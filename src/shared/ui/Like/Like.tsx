import { useState, useEffect, useRef, type MouseEventHandler } from "react";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { createLike, deleteLike } from "@entities/like/model/slice";
import {
  updateUserInState,
  updateUserLikesOptimistic,
} from "@entities/user/model/slice";
import styles from "./like.module.scss";
import type { ILikeProps } from "./like.types";
import { useLocation, useNavigate } from "react-router-dom";
import { selectUser } from "@/features/auth/model/slice";
import { DecoratedButton } from "../DecoratedButton/DecoratedButton";

export const Like = (props: ILikeProps) => {
  const {
    currentLikeCount,
    isLiked: initialIsLiked = false,
    userId,
    isAuthenticated = false,
    className = "",
  } = props;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const [likeCount, setLikeCount] = useState(currentLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const pendingRequestRef = useRef<Promise<void> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Синхронизируем состояние с пропсами
  useEffect(() => {
    setLikeCount(currentLikeCount);
    setIsLiked(initialIsLiked);
  }, [currentLikeCount, initialIsLiked]);

  const toggleliked: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    if (currentUser && currentUser?.id === userId) return;

    // Если пользователь не авторизован, не позволяем ставить лайки
    if (!isAuthenticated) {
      sessionStorage.setItem("redirectPath", location.pathname);
      navigate("/login", { state: { from: location } });
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
      {isLiked ? (
        <DecoratedButton onClick={toggleliked} variant="heartFill" />
      ) : (
        <DecoratedButton
          onClick={toggleliked}
          variant="heart"
          isUser={currentUser?.id === userId}
        />
      )}
    </div>
  );
};
