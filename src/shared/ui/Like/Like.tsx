import { useState, useEffect, useRef, type MouseEventHandler } from "react";
import { useAppDispatch } from "@app/store/hooks";
import { createLike, deleteLike } from "@entities/like/model/slice";
import {
  updateUserInState,
  updateUserLikesOptimistic,
} from "@entities/user/model/slice";
import styles from "./like.module.scss";
import type { ILikeProps } from "./like.types";

export const Like = (props: ILikeProps) => {
  const {
    currentLikeCount,
    isLiked: initialIsLiked = false,
    userId,
    isAuthenticated = false,
    className = "",
  } = props;
  const dispatch = useAppDispatch();
  const [likeCount, setLikeCount] = useState(currentLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const pendingRequestRef = useRef<Promise<void> | null>(null);

  // Синхронизируем состояние с пропсами
  useEffect(() => {
    setLikeCount(currentLikeCount);
    setIsLiked(initialIsLiked);
  }, [currentLikeCount, initialIsLiked]);

  const toggleliked: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    // Если пользователь не авторизован, не позволяем ставить лайки
    if (!isAuthenticated) {
      // TODO: переадресация на страницу авторизации
      return;
    }

    // Если уже есть запрос в процессе, ждем его завершения
    if (pendingRequestRef.current) {
      await pendingRequestRef.current;
    }

    const newIsLike = !isLiked;
    const newLikeCount = newIsLike ? likeCount + 1 : likeCount - 1;

    // Оптимистичное обновление UI и Redux - сразу обновляем состояние везде
    setIsLiked(newIsLike);
    setLikeCount(newLikeCount);
    dispatch(
      updateUserLikesOptimistic({
        userId,
        isLiked: newIsLike,
        likesCount: newLikeCount,
      }),
    );
    props.onLikeToggle?.(newLikeCount);

    // Создаем промис для текущего запроса
    const requestPromise = (async () => {
      setIsLoading(true);
      try {
        if (newIsLike) {
          await dispatch(createLike({ toUserId: userId })).unwrap();
        } else {
          await dispatch(deleteLike(userId)).unwrap();
        }

        // Обновляем только этого пользователя для синхронизации с сервером
        await dispatch(updateUserInState(userId));
      } catch (error) {
        console.error("Ошибка при изменении лайка:", error);
        // Откатываем оптимистичное обновление при ошибке
        setIsLiked(!newIsLike);
        setLikeCount(likeCount);
        dispatch(
          updateUserLikesOptimistic({
            userId,
            isLiked: !newIsLike,
            likesCount: likeCount,
          }),
        );
        props.onLikeToggle?.(likeCount);
      } finally {
        setIsLoading(false);
        pendingRequestRef.current = null;
      }
    })();

    pendingRequestRef.current = requestPromise;
  };

  return (
    <div className={`${styles.likeWrapper} ${className}`}>
      <span
        className={`${styles.likeCount} ${isLiked && styles.likeCountActive}`}
      >
        {likeCount}
      </span>
      <button
        className={`${styles.likeButton} ${isLiked && styles.likeActive}`}
        onClick={toggleliked}
        disabled={isLoading}
        aria-label={isLiked ? "Убрать лайк" : "Поставить лайк"}
        aria-busy={isLoading}
      ></button>
    </div>
  );
};
