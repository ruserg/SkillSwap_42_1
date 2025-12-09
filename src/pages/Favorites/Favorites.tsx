import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { fetchUsersData, selectUsersData } from "@entities/user/model/slice";
import { selectCities, fetchCities } from "@entities/city/model/slice";
import { selectIsAuthenticated } from "@features/auth/model/slice";
import { Card } from "@shared/ui/Card/Card";
import { CardSkeleton } from "@shared/ui/CardSkeleton/CardSkeleton";
import type { UserWithLikes } from "@entities/user/types";
import styles from "./favorites.module.scss";

export const Favorites = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading } = useAppSelector(selectUsersData);
  const { cities } = useAppSelector(selectCities);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Загружаем данные при монтировании
  useEffect(() => {
    if (users.length === 0 && !isLoading) {
      dispatch(fetchUsersData());
    }
    if (cities.length === 0) {
      dispatch(fetchCities());
    }
  }, [dispatch, users.length, isLoading, cities.length]);

  // Фильтруем только лайкнутых пользователей
  const likedUsers = useMemo(() => {
    return users.filter((user) => user.isLikedByCurrentUser === true);
  }, [users]);

  // Сортируем по дате регистрации (от новых к старым) как приближение даты добавления в избранное
  const sortedLikedUsers = useMemo(() => {
    return [...likedUsers].sort(
      (a, b) =>
        new Date(b.dateOfRegistration).getTime() -
        new Date(a.dateOfRegistration).getTime(),
    );
  }, [likedUsers]);

  // Обработчик клика на карточку (переход на детальную страницу)
  const handleDetailsClick = (user: UserWithLikes) => {
    // TODO: Реализовать навигацию к детальной странице пользователя
    // navigate(`/user/${user.id}`);
    console.log("User details clicked:", user);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Избранное</h1>
        <div className={styles.cardsGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (sortedLikedUsers.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Избранное</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            Здесь пока пусто. Добавьте карточки в избранное!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Избранное</h1>
      <p className={styles.subtitle}>
        Найдено карточек: {sortedLikedUsers.length}
      </p>
      <div className={styles.cardsGrid}>
        {sortedLikedUsers.map((user) => (
          <Card
            key={user.id}
            user={user}
            cities={cities}
            isAuthenticated={isAuthenticated}
            onDetailsClick={handleDetailsClick}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};
