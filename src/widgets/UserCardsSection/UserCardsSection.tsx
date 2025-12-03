import { useEffect, useMemo, useState } from "react";
import { Card } from "@shared/ui/Card";
import { CardSkeleton } from "@shared/ui/CardSkeleton/CardSkeleton";
import type { TUser, UserWithLikes } from "@/shared/types/types";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { fetchUsersData, selectUsersData } from "@store/slices/usersDataSlice";
import { selectReferenceData } from "@store/slices/referenceDataSlice";
import {
  fetchSkillsData,
  selectSkillsData,
} from "@store/slices/skillsDataSlice";
import { useFilteredUsers } from "@shared/hooks/useFilteredUsers";
import type { TFilterState } from "@widgets/filter/filter.type";
import { ActiveFilters } from "@widgets/ActiveFilters/ActiveFilters";
import { Button } from "@shared/ui/Button/Button";
import chevronRight from "@images/icons/chevron-right.svg";
import styles from "./userCardsSection.module.scss";

interface UserCardsSectionProps {
  filters: TFilterState;
  onFiltersChange: (filters: TFilterState) => void;
}

export const UserCardsSection = ({
  filters,
  onFiltersChange,
}: UserCardsSectionProps) => {
  const dispatch = useAppDispatch();
  const { users, isLoading: usersLoading } = useAppSelector(selectUsersData);
  const { cities, subcategories } = useAppSelector(selectReferenceData);
  const {
    skills,
    likes,
    isLoading: skillsLoading,
  } = useAppSelector(selectSkillsData);

  const isLoading = usersLoading || skillsLoading;

  // Состояния для отслеживания, сколько элементов показывать (по умолчанию 3)
  const [popularCount, setPopularCount] = useState(3);
  const [newCount, setNewCount] = useState(3);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    // Загружаем данные только если они еще не загружены
    if (users.length === 0 && !usersLoading) {
      dispatch(fetchUsersData());
    }
    if (skills.length === 0 && !skillsLoading) {
      dispatch(fetchSkillsData());
    }
  }, [dispatch, users.length, usersLoading, skills.length, skillsLoading]);

  // Подсчет лайков для каждого пользователя
  const usersWithLikes = useMemo(() => {
    // Создаем Map для подсчета лайков по skillId
    const likesBySkillId = new Map<number, number>();
    likes.forEach((like) => {
      const currentCount = likesBySkillId.get(like.skillId) || 0;
      likesBySkillId.set(like.skillId, currentCount + 1);
    });

    // Подсчитываем общее количество лайков для каждого пользователя
    return users.map((user) => {
      const userSkills = skills.filter((skill) => skill.userId === user.id);
      const likesCount = userSkills.reduce((total, skill) => {
        return total + (likesBySkillId.get(skill.id) || 0);
      }, 0);

      return {
        ...user,
        likesCount,
      } as UserWithLikes;
    });
  }, [users, skills, likes]);

  // Все популярные пользователи (по количеству лайков)
  const allPopularUsers = useMemo(() => {
    return [...usersWithLikes].sort((a, b) => b.likesCount - a.likesCount);
  }, [usersWithLikes]);

  // Популярные пользователи для отображения
  const popularUsers = useMemo(() => {
    return allPopularUsers.slice(0, popularCount);
  }, [allPopularUsers, popularCount]);

  // Все новые пользователи (по дате регистрации)
  const allNewUsers = useMemo(() => {
    return [...users].sort(
      (a, b) =>
        new Date(b.dateOfRegistration).getTime() -
        new Date(a.dateOfRegistration).getTime(),
    );
  }, [users]);

  // Новые пользователи для отображения
  const newUsers = useMemo(() => {
    return allNewUsers.slice(0, newCount);
  }, [allNewUsers, newCount]);

  // Рекомендуемые пользователи (берем пользователей, которые не входят в популярных и новых)
  const recommendedUsers = useMemo(() => {
    // Исключаем пользователей, которые уже есть в показанных популярных и новых
    const popularIds = new Set(popularUsers.map((u) => u.id));
    const newIds = new Set(newUsers.map((u) => u.id));
    const excludedIds = new Set([...popularIds, ...newIds]);

    const availableUsers = usersWithLikes.filter((u) => !excludedIds.has(u.id));

    // Сортируем по количеству лайков и берем топ-6
    return [...availableUsers]
      .sort((a, b) => b.likesCount - a.likesCount)
      .slice(0, 6);
  }, [usersWithLikes, popularUsers, newUsers]);

  // Используем хук для фильтрации пользователей
  const { filteredOffers, filteredUsers, hasActiveFilters } = useFilteredUsers({
    filters,
    usersWithLikes,
    skills,
  });

  const handleDetailsClick = (user: TUser) => {
    console.log("User details clicked:", user);
    // TODO: Реализовать навигацию к детальной странице пользователя
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        {hasActiveFilters ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Подходящие предложения: 0</h2>
            <div className={styles.cardsGrid}>
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Скелетоны для секции "Популярное" */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Популярное</h2>
              <div className={styles.cardsGrid}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            </section>

            {/* Скелетоны для секции "Новое" */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Новое</h2>
              <div className={styles.cardsGrid}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            </section>

            {/* Скелетоны для секции "Рекомендуем" */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Рекомендуем</h2>
              <div className={styles.cardsGrid}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    );
  }

  // Если есть активные фильтры, показываем отфильтрованные предложения
  if (hasActiveFilters) {
    return (
      <div className={styles.container}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Подходящие предложения: {filteredOffers.length}
            </h2>
            <ActiveFilters
              filters={filters}
              subcategories={subcategories}
              cities={cities}
              onFiltersChange={onFiltersChange}
            />
          </div>
          <div className={styles.cardsGrid}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Card
                  key={user.id}
                  user={user}
                  cities={cities}
                  onDetailsClick={handleDetailsClick}
                  isLoading={isLoading}
                />
              ))
            ) : (
              <p className={styles.noResults}>
                По выбранным фильтрам ничего не найдено
              </p>
            )}
          </div>
        </section>
      </div>
    );
  }

  // Если фильтров нет, показываем стандартные секции
  return (
    <div className={styles.container}>
      {/* Секция "Популярное" */}
      <section className={styles.section}>
        <div className={styles.sectionTitleRow}>
          <h2 className={styles.sectionTitle}>Популярное</h2>
          {allPopularUsers.length > 3 && (
            <div className={styles.viewAllButtonWrapper}>
              <Button
                variant="secondary"
                rightIcon={<img src={chevronRight} alt="" />}
                onClick={() => setPopularCount((prev) => prev + 3)}
                disabled={popularCount >= 6}
              >
                Смотреть все
              </Button>
            </div>
          )}
        </div>
        <div className={styles.cardsGrid}>
          {popularUsers.map((user) => (
            <Card
              key={user.id}
              user={user}
              cities={cities}
              onDetailsClick={handleDetailsClick}
              isLoading={isLoading}
            />
          ))}
        </div>
      </section>

      {/* Секция "Новое" */}
      <section className={styles.section}>
        <div className={styles.sectionTitleRow}>
          <h2 className={styles.sectionTitle}>Новое</h2>
          {allNewUsers.length > 3 && (
            <div className={styles.viewAllButtonWrapper}>
              <Button
                variant="secondary"
                rightIcon={<img src={chevronRight} alt="" />}
                onClick={() => setNewCount((prev) => prev + 3)}
                disabled={newCount >= 6}
              >
                Смотреть все
              </Button>
            </div>
          )}
        </div>
        <div className={styles.cardsGrid}>
          {newUsers.map((user) => (
            <Card
              key={user.id}
              user={user}
              cities={cities}
              onDetailsClick={handleDetailsClick}
              isLoading={isLoading}
            />
          ))}
        </div>
      </section>

      {/* Секция "Рекомендуем" */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Рекомендуем</h2>
        <div className={styles.cardsGrid}>
          {recommendedUsers.map((user) => (
            <Card
              key={user.id}
              user={user}
              cities={cities}
              onDetailsClick={handleDetailsClick}
              isLoading={isLoading}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
