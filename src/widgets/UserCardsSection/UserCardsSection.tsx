import { useEffect, useMemo, useRef, useState } from "react";
import { CardsSection } from "@shared/ui/CardsSection/CardsSection";
import { UserCardsList } from "@shared/ui/UserCardsList/UserCardsList";
import type { UserWithLikes } from "@entities/user/types";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { fetchUsersData, selectUsersData } from "@entities/user/model/slice";
import { selectCategoryData } from "@entities/category/model/slice";
import { selectCities, fetchCities } from "@entities/city/model/slice";
import { fetchSkillsData, selectSkillsData } from "@entities/skill/model/slice";
import { useFilteredUsers } from "@features/filter-users/model/useFilteredUsers";
import type { TFilterState } from "@features/filter-users/types";
import { ActiveFilters } from "@widgets/ActiveFilters/ActiveFilters";
import styles from "./userCardsSection.module.scss";
import { Button } from "@/shared/ui/Button/Button";
import { useInfinityScroll } from "@/shared/hooks/useInfinityScroll";
import { Arrow } from "@/shared/ui/Arrow/Arrow";
import { SortSvg } from "./svg/SortSvg";

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

  const isLoading = usersLoading || skillsLoading;

  const popularSentinelRef = useRef<HTMLDivElement | null>(null);
  const newSentinelRef = useRef<HTMLDivElement | null>(null);
  const recommendationsSentinelRef = useRef<HTMLDivElement | null>(null);

  const [popularCount, setPopularCount] = useState(3);
  const [newCount, setNewCount] = useState(3);
  const [recommendationsCount, setRecommendationsCount] = useState(3);
  const [isInfinityScrollActivated, setIsInfinityScrollActivated] = useState({
    popular: false,
    new: false,
  });
  const [sortByDate, setSortByDate] = useState(false);

  // Загрузка данных
  useEffect(() => {
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

  // Все популярные пользователи
  const allPopularUsers = useMemo(() => {
    return [...users].sort((a, b) => b.likesCount - a.likesCount);
  }, [users]);

  const allNewUsers = useMemo(() => {
    return [...users].sort(
      (a, b) =>
        new Date(b.dateOfRegistration).getTime() -
        new Date(a.dateOfRegistration).getTime(),
    );
  }, [users]);

  const popularUsers = useMemo(() => {
    return allPopularUsers.slice(0, popularCount);
  }, [allPopularUsers, popularCount]);

  const newUsers = useMemo(() => {
    return allNewUsers.slice(0, newCount);
  }, [allNewUsers, newCount]);

  const recommendedUsers = useMemo(() => {
    return [...users].slice(0, recommendationsCount);
  }, [users, recommendationsCount]);

  // Бесконечный скролл
  const { loadMoreList: loadMorePopular, hideMoreList: hideMorePopular } =
    useInfinityScroll({
      triggerArray: allPopularUsers,
      isSectionActive: isInfinityScrollActivated,
      scrollSection: "popular",
      nextNumber: 3,
      setCountState: setPopularCount,
      setSectionActive: setIsInfinityScrollActivated,
      sentinelRef: popularSentinelRef,
    });

  const { loadMoreList: loadMoreNew, hideMoreList: hideMoreNew } =
    useInfinityScroll({
      triggerArray: allNewUsers,
      isSectionActive: isInfinityScrollActivated,
      scrollSection: "new",
      nextNumber: 3,
      setCountState: setNewCount,
      setSectionActive: setIsInfinityScrollActivated,
      sentinelRef: newSentinelRef,
    });

  useInfinityScroll({
    triggerArray: users,
    nextNumber: 6,
    setCountState: setRecommendationsCount,
    sentinelRef: recommendationsSentinelRef,
    isWithoutToggle: true,
    currentCount: recommendationsCount,
  });

  const { filteredOffers, sortedUsers, hasActiveFilters } = useFilteredUsers({
    filters,
    usersWithLikes: users,
    skills,
    sortByDate,
  });

  const handleHideAll = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    hideMorePopular(3);
    hideMoreNew(3);
    setRecommendationsCount(3);
  };

  const handleUserClick = (user: UserWithLikes) => {
    console.log("User details clicked:", user);
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
            <CardsSection title="Популярное">
              <UserCardsList users={[]} cities={cities} isLoading={true} />
            </CardsSection>
            <CardsSection title="Новое">
              <UserCardsList users={[]} cities={cities} isLoading={true} />
            </CardsSection>
            <CardsSection title="Рекомендуем">
              <UserCardsList users={[]} cities={cities} isLoading={true} />
            </CardsSection>
          </>
        )}
      </div>
    );
  }

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
        <CardsSection headerContent={headerContent}>
          <UserCardsList
            users={sortedUsers}
            cities={cities}
            emptyMessage="По выбранным фильтрам ничего не найдено"
            onUserClick={handleUserClick}
          />
        </CardsSection>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Секция "Популярное" */}
      <CardsSection
        title="Популярное"
        showViewAll
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
        <UserCardsList
          users={popularUsers}
          cities={cities}
          onUserClick={handleUserClick}
        />
      </CardsSection>

      {/* Секция "Новое" */}
      <CardsSection
        title="Новое"
        showViewAll
        viewAllProps={{
          behavior: "hide",
          initialCount: 3,
          currentCount: newCount,
          totalCount: allNewUsers.length,
          onLoadMore: loadMoreNew,
        }}
        sentinelRef={isInfinityScrollActivated.new ? newSentinelRef : undefined}
      >
        <UserCardsList
          users={newUsers}
          cities={cities}
          onUserClick={handleUserClick}
        />
      </CardsSection>

      {/* Секция "Рекомендуем" */}
      <CardsSection
        title="Рекомендуем"
        sentinelRef={recommendationsSentinelRef}
      >
        <UserCardsList
          users={recommendedUsers}
          cities={cities}
          onUserClick={handleUserClick}
        />
      </CardsSection>

      {recommendationsCount >= users.length && (
        <div className={styles.backToTop}>
          <Button variant="secondary" onClick={handleHideAll}>
            К началу страницы
            <Arrow isOpen={true} />
          </Button>
        </div>
      )}
    </div>
  );
};
