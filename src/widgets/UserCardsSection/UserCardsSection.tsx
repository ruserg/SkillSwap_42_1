import { useEffect, useMemo, useRef, useState } from "react";
import { CardsSection } from "@shared/ui/CardsSection/CardsSection";
import { UserCardsList } from "@shared/ui/UserCardsList/UserCardsList";
import { ViewAllButton } from "@shared/ui/ViewAllButton/ViewAllButton";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { fetchUsersData, selectUsersData } from "@entities/user/model/slice";
import { selectCategoryData } from "@entities/category/model/slice";
import { selectCities } from "@entities/city/model/slice";
import { fetchSkillsData, selectSkillsData } from "@entities/skill/model/slice";
import { useFilteredUsers } from "@features/filter-users/model/useFilteredUsers";
import type { TFilterState } from "@features/filter-users/types";
import { ActiveFilters } from "@widgets/ActiveFilters/ActiveFilters";
import styles from "./userCardsSection.module.scss";
import { Button } from "@/shared/ui/Button/Button";
import { useInfinityScroll } from "@/shared/hooks/useInfinityScroll";
import { Arrow } from "@/shared/ui/Arrow/Arrow";
import { SortSvg } from "./svg/SortSvg";
import { selectUser as selectAuthUser } from "@features/auth/model/slice";

interface UserCardsSectionProps {
  filters: TFilterState;
  onFiltersChange: (filters: TFilterState) => void;
}

export const UserCardsSection = ({
  filters,
  onFiltersChange,
}: UserCardsSectionProps) => {
  const { users, isLoading: usersLoading } = useAppSelector(selectUsersData);
  const { subcategories } = useAppSelector(selectCategoryData);
  const { cities } = useAppSelector(selectCities);
  const { skills, isLoading: skillsLoading } = useAppSelector(selectSkillsData);
  const dispatch = useAppDispatch();

  const isLoading = usersLoading || skillsLoading;

  const popularSentinelRef = useRef<HTMLDivElement | null>(null);
  const newSentinelRef = useRef<HTMLDivElement | null>(null);
  const recommendationsSentinelRef = useRef<HTMLDivElement | null>(null);

  const [popularCount, setPopularCount] = useState(3);
  const [newCount, setNewCount] = useState(3);
  const [recommendationsCount, setRecommendationsCount] = useState(21);
  const [isInfinityScrollActivated, setIsInfinityScrollActivated] = useState({
    popular: false,
    new: false,
  });

  const [sortByDate, setSortByDate] = useState(false);

  useEffect(() => {
    if (users.length === 0 && !usersLoading) dispatch(fetchUsersData());
    if (skills.length === 0 && !skillsLoading) dispatch(fetchSkillsData());
  }, [dispatch, users.length, usersLoading, skills.length, skillsLoading]);

  //добавляем селектор, чтобы автор не попадал в списки
  const authUser = useAppSelector(selectAuthUser);

  // const usersWithLikes = users;
  const usersWithLikes = useMemo(() => {
    if (!authUser) return users;

    return users.filter((user) => user.id !== authUser.id);
  }, [users, authUser]);

  // Все популярные пользователи (по количеству лайков)
  const allPopularUsers = useMemo(() => {
    return [...usersWithLikes].sort((a, b) => b.likesCount - a.likesCount);
  }, [usersWithLikes]);

  const popularUsers = useMemo(() => {
    return allPopularUsers.slice(0, popularCount);
  }, [allPopularUsers, popularCount]);

  // Все новые пользователи (по дате регистрации)
  const allNewUsers = useMemo(() => {
    return [...usersWithLikes].sort(
      (a, b) =>
        new Date(b.dateOfRegistration).getTime() -
        new Date(a.dateOfRegistration).getTime(),
    );
  }, [usersWithLikes]);

  const newUsers = useMemo(() => {
    return allNewUsers.slice(0, newCount);
  }, [allNewUsers, newCount]);

  const recommendedUsers = useMemo(() => {
    return [...usersWithLikes].slice(0, recommendationsCount);
  }, [usersWithLikes, recommendationsCount]);

  // Бесконечный скролл для популярных пользователей
  const { loadMoreList: loadMorePopular, hideMoreList: hideMorePopular } =
    useInfinityScroll({
      triggerArray: allPopularUsers,
      isSectionActive: isInfinityScrollActivated,
      scrollSection: "popular",
      nextNumber: 21,
      setCountState: setPopularCount,
      setSectionActive: setIsInfinityScrollActivated,
      sentinelRef: popularSentinelRef,
    });

  // Бесконечный скролл для новых пользователей
  const { loadMoreList: loadMoreNew, hideMoreList: hideMoreNew } =
    useInfinityScroll({
      triggerArray: allNewUsers,
      isSectionActive: isInfinityScrollActivated,
      scrollSection: "new",
      nextNumber: 21,
      setCountState: setNewCount,
      setSectionActive: setIsInfinityScrollActivated,
      sentinelRef: newSentinelRef,
    });

  // Бесконечный скролл для рекомендаций
  useInfinityScroll({
    triggerArray: usersWithLikes,
    nextNumber: 21,
    setCountState: setRecommendationsCount,
    sentinelRef: recommendationsSentinelRef,
    isWithoutToggle: true,
    currentCount: recommendationsCount,
  });

  // Используем хук для фильтрации пользователей
  const { filteredOffers, sortedUsers, hasActiveFilters } = useFilteredUsers({
    filters,
    usersWithLikes,
    skills,
    sortByDate,
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        {hasActiveFilters ? (
          <CardsSection title={`Подходящие предложения: 0`}>
            <UserCardsList
              users={[]}
              cities={cities}
              isLoading={true}
              emptyMessage=""
            />
          </CardsSection>
        ) : (
          <>
            {/* Скелетоны для секции "Популярное" */}
            <CardsSection title="Популярное">
              <UserCardsList users={[]} cities={cities} isLoading={true} />
            </CardsSection>

            {/* Скелетоны для секции "Новое" */}
            <CardsSection title="Новое">
              <UserCardsList users={[]} cities={cities} isLoading={true} />
            </CardsSection>

            {/* Скелетоны для секции "Рекомендуем" */}
            <CardsSection title="Рекомендуем">
              <UserCardsList users={[]} cities={cities} isLoading={true} />
            </CardsSection>
          </>
        )}
      </div>
    );
  }

  // Если есть активные фильтры, показываем отфильтрованные предложения
  if (hasActiveFilters) {
    const sortButton = (
      <Button
        variant={sortByDate ? "primary" : "tertiary"}
        otherClassNames={styles.buttonSort}
        onClick={() => setSortByDate(!sortByDate)}
      >
        <SortSvg
          aria-label={sortByDate ? "Без сортировки" : "Сначала новые"}
          aria-hidden="true"
        />
        {sortByDate ? "Без сортировки" : "Сначала новые"}
      </Button>
    );

    const headerContent = (
      <>
        <div className={styles.sectionTitleWrapper}>
          <h2 className={styles.sectionTitle}>
            Подходящие предложения: {filteredOffers.length}
          </h2>
          {sortButton}
        </div>
        <ActiveFilters
          filters={filters}
          subcategories={subcategories}
          cities={cities}
          onFiltersChange={onFiltersChange}
        />
      </>
    );

    return (
      <div className={styles.container}>
        <CardsSection title="" headerContent={headerContent}>
          <UserCardsList
            users={sortedUsers}
            cities={cities}
            emptyMessage="По выбранным фильтрам ничего не найдено"
          />
        </CardsSection>
      </div>
    );
  }

  // Если фильтров нет, показываем стандартные секции
  return (
    <div className={styles.container}>
      {/* Секция "Популярное" */}
      <CardsSection
        title="Популярное"
        showViewAll={!isInfinityScrollActivated.popular}
        viewAllProps={{
          behavior: "hide",
          initialCount: 3,
          currentCount: popularCount,
          totalCount: allPopularUsers.length,
          onLoadMore: loadMorePopular,
        }}
        sentinelRef={
          isInfinityScrollActivated.popular ? popularSentinelRef : undefined
        }
      >
        <UserCardsList users={popularUsers} cities={cities} />
      </CardsSection>

      {/* Кнопка "Свернуть" для секции "Популярное" (после активации бесконечного скролла) */}
      {isInfinityScrollActivated.popular && (
        <div className={styles.collapseButtonContainer}>
          <ViewAllButton
            behavior="2-way"
            initialCount={3}
            currentCount={popularCount}
            totalCount={allPopularUsers.length}
            onLoadMore={hideMorePopular}
          />
        </div>
      )}

      {/* Секция "Новое" */}
      <CardsSection
        title="Новое"
        showViewAll={!isInfinityScrollActivated.new}
        viewAllProps={{
          behavior: "hide",
          initialCount: 3,
          currentCount: newCount,
          totalCount: allNewUsers.length,
          onLoadMore: loadMoreNew,
        }}
        sentinelRef={isInfinityScrollActivated.new ? newSentinelRef : undefined}
      >
        <UserCardsList users={newUsers} cities={cities} />
      </CardsSection>

      {/* Кнопка "Свернуть" для секции "Новое" (после активации бесконечного скролла) */}
      {isInfinityScrollActivated.new && (
        <div className={styles.collapseButtonContainer}>
          <ViewAllButton
            behavior="2-way"
            initialCount={3}
            currentCount={newCount}
            totalCount={allNewUsers.length}
            onLoadMore={hideMoreNew}
          />
        </div>
      )}

      {/* Секция "Рекомендуем" */}
      <CardsSection
        title="Рекомендуем"
        sentinelRef={recommendationsSentinelRef}
      >
        <UserCardsList users={recommendedUsers} cities={cities} />
      </CardsSection>

      {/* Кнопка "К началу страницы" (для секции "Рекомендуем") */}
      {recommendationsCount >= usersWithLikes.length && (
        <div className={styles.backToTop}>
          <Button variant="secondary" onClick={() => hideAllSection(3)}>
            К началу страницы
            <Arrow isOpen={true} />
          </Button>
        </div>
      )}
    </div>
  );
};
