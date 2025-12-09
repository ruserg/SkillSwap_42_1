import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@shared/ui/Card/Card";
import { CardSkeleton } from "@shared/ui/CardSkeleton/CardSkeleton";
import type { UserWithLikes } from "@entities/user/types";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { fetchUsersData, selectUsersData } from "@entities/user/model/slice";
import { selectCategoryData } from "@entities/category/model/slice";
import { selectCities, fetchCities } from "@entities/city/model/slice";
import { fetchSkillsData, selectSkillsData } from "@entities/skill/model/slice";
import { selectIsAuthenticated } from "@features/auth/model/slice";
import { useFilteredUsers } from "@features/filter-users/model/useFilteredUsers";
import type { TFilterState } from "@features/filter-users/types";
import { ActiveFilters } from "@widgets/ActiveFilters/ActiveFilters";
import { ViewAllButton } from "@shared/ui/ViewAllButton/ViewAllButton";
import styles from "./userCardsSection.module.scss";
import { Button } from "@/shared/ui/Button/Button";

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
  const { subcategories } = useAppSelector(selectCategoryData);
  const { cities } = useAppSelector(selectCities);
  const { skills, isLoading: skillsLoading } = useAppSelector(selectSkillsData);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const isLoading = usersLoading || skillsLoading;

  const popularSentinelRef = useRef<HTMLDivElement | null>(null);
  const newSentinelRef = useRef<HTMLDivElement | null>(null);
  const recommendationsSentinelRef = useRef<HTMLDivElement | null>(null);

  // Состояния для отслеживания, сколько элементов показывать (по умолчанию 3)
  const [popularCount, setPopularCount] = useState(3);
  const [newCount, setNewCount] = useState(3);
  const [recommendationsCount, setRecommendationsCount] = useState(3);
  const [isInfinityScrollActivated, setIsInfinityScrollActivated] = useState({
    popular: false,
    new: false,
  });

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    // Загружаем данные только если они еще не загружены
    if (users.length === 0 && !usersLoading) {
      dispatch(fetchUsersData());
    }
    if (skills.length === 0 && !skillsLoading) {
      dispatch(fetchSkillsData());
    }
    if (cities.length === 0) {
      dispatch(fetchCities());
    }
  }, [
    dispatch,
    users.length,
    usersLoading,
    skills.length,
    skillsLoading,
    cities.length,
  ]);

  // Пользователи уже приходят с информацией о лайках из API
  const usersWithLikes = users;

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

  // Рекомендуемые пользователи для отображения
  const recommendedUsers = useMemo(() => {
    return [...users].slice(0, recommendationsCount);
  }, [users, recommendationsCount]);

  // Бесконечный скролл для популярных пользователей
  useEffect(() => {
    if (users.length === 0) return;
    if (!isInfinityScrollActivated.popular) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          setPopularCount((prev) => {
            if (prev + 3 >= allPopularUsers.length) {
              setIsInfinityScrollActivated((prev) => ({
                ...prev,
                popular: true,
              }));
              return allPopularUsers.length;
            }
            return prev + 3;
          });
        });
      },
      {
        root: null,
        threshold: 0,
      },
    );

    const isElementInViewport = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom >= 0;
    };

    if (popularSentinelRef.current) {
      observer.observe(popularSentinelRef.current);

      if (isElementInViewport(popularSentinelRef.current)) {
        setPopularCount((prev) => prev + 3);
      }
    }

    return () => observer.disconnect();
  }, [users, allPopularUsers, isInfinityScrollActivated.popular]);

  //Бесконечный скролл для новых пользователей
  useEffect(() => {
    if (users.length === 0) return;
    if (!isInfinityScrollActivated.new) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          setNewCount((prev) => {
            if (prev + 3 >= allNewUsers.length) {
              setIsInfinityScrollActivated((prev) => ({
                ...prev,
                new: true,
              }));
              return allNewUsers.length;
            }
            return prev + 3;
          });
        });
      },
      {
        root: null,
        threshold: 0,
      },
    );

    const isElementInViewport = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom >= 0;
    };

    if (newSentinelRef.current) {
      observer.observe(newSentinelRef.current);

      if (isElementInViewport(newSentinelRef.current)) {
        setNewCount((prev) => prev + 3);
      }
    }

    return () => observer.disconnect();
  }, [users, allNewUsers, isInfinityScrollActivated.new]);

  // Бесконечный скролл для рекомендаций
  useEffect(() => {
    if (users.length === 0) return;
    if (recommendationsCount >= users.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          setRecommendationsCount((prev) => {
            if (prev + 6 > users.length) {
              return users.length;
            }
            return prev + 6;
          });
        });
      },
      {
        root: null,
        threshold: 0,
      },
    );

    const isElementInViewport = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom >= 0;
    };

    if (recommendationsSentinelRef.current) {
      observer.observe(recommendationsSentinelRef.current);

      if (isElementInViewport(recommendationsSentinelRef.current)) {
        setRecommendationsCount((prev) => prev + 6);
      }
    }

    return () => observer.disconnect();
  }, [users, recommendationsCount]);

  const loadMorePopular = () => {
    setIsInfinityScrollActivated((prev) => ({
      ...prev,
      popular: true,
    }));
  };

  const hideMorePopular = (count: number) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPopularCount(count);
    setIsInfinityScrollActivated((prev) => ({
      ...prev,
      popular: false,
    }));
  };

  const loadMoreNew = () => {
    setIsInfinityScrollActivated((prev) => ({
      ...prev,
      new: true,
    }));
  };

  const hideMoreNew = (count: number) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setNewCount(count);
    setIsInfinityScrollActivated((prev) => ({
      ...prev,
      new: false,
    }));
  };

  // Используем хук для фильтрации пользователей
  const { filteredOffers, filteredUsers, hasActiveFilters } = useFilteredUsers({
    filters,
    usersWithLikes,
    skills,
  });

  const hideAllSection = (count: number) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    hideMorePopular(count);
    hideMoreNew(count);
    setRecommendationsCount(count);
  };

  const handleDetailsClick = (user: UserWithLikes) => {
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
                  isAuthenticated={isAuthenticated}
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
    <div
      className={styles.container}
      onScroll={(e) => {
        console.log(e.target);
      }}
    >
      {/* Секция "Популярное" */}
      <section className={styles.section}>
        <div className={styles.sectionTitleRow}>
          <h2 className={styles.sectionTitle}>Популярное</h2>
          <ViewAllButton
            behavior="hide"
            initialCount={3}
            currentCount={popularCount}
            totalCount={allPopularUsers.length}
            onLoadMore={loadMorePopular}
          />
        </div>
        <div className={styles.cardsGrid}>
          {popularUsers.map((user) => (
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
        {isInfinityScrollActivated.popular && (
          <>
            <div ref={popularSentinelRef} className={styles.sentinel}></div>
            <ViewAllButton
              behavior="2-way"
              initialCount={3}
              currentCount={popularCount}
              totalCount={allPopularUsers.length}
              onLoadMore={hideMorePopular}
            />
          </>
        )}
      </section>

      {/* Секция "Новое" */}
      <section className={styles.section}>
        <div className={styles.sectionTitleRow}>
          <h2 className={styles.sectionTitle}>Новое</h2>
          <ViewAllButton
            behavior="hide"
            initialCount={3}
            currentCount={newCount}
            totalCount={allNewUsers.length}
            onLoadMore={loadMoreNew}
          />
        </div>
        <div className={styles.cardsGrid}>
          {newUsers.map((user) => (
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
        {isInfinityScrollActivated.new && (
          <>
            <div ref={newSentinelRef} className={styles.sentinel}></div>
            <ViewAllButton
              behavior="2-way"
              initialCount={3}
              currentCount={newCount}
              totalCount={allNewUsers.length}
              onLoadMore={hideMoreNew}
            />
          </>
        )}
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
              isAuthenticated={isAuthenticated}
              onDetailsClick={handleDetailsClick}
              isLoading={isLoading}
            />
          ))}
          <div
            ref={recommendationsSentinelRef}
            className={styles.sentinel}
          ></div>
        </div>
        {recommendationsCount >= users.length && (
          <Button variant="secondary" onClick={() => hideAllSection(3)}>
            К началу страницы
          </Button>
        )}
      </section>
    </div>
  );
};
