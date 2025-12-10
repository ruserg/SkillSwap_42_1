import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./mainPage.module.scss";
import { Filter } from "@widgets/Filter/Filter";
import { UserCardsSection } from "@widgets/UserCardsSection/UserCardsSection";
import type { TFilterState } from "@features/filter-users/types";
import { useAppSelector } from "@app/store/hooks";
import { selectCategoryData } from "@entities/category/model/slice";

export const MainPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<TFilterState>({
    purpose: "",
    skills: [],
    gender: "",
    cityAll: [],
  });

  const { subcategories } = useAppSelector(selectCategoryData);

  // Обрабатываем поисковый запрос из URL
  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchingSubcategories = subcategories
        .filter((sub) => sub.name.toLowerCase().includes(searchLower))
        .map((sub) => sub.id);

      setFilters((prev) => ({
        ...prev,
        skills: matchingSubcategories,
      }));
    }
  }, [searchParams, subcategories]);

  const clearSearchQuery = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("q");
    setSearchParams(newSearchParams);
  };

  return (
    <div className={styles.main}>
      <aside className={styles.filterContainer}>
        <Filter
          filters={filters}
          onFiltersChange={setFilters}
          onClearSearchQuery={clearSearchQuery}
        />
      </aside>
      <section className={styles.galleryContainer}>
        <UserCardsSection filters={filters} onFiltersChange={setFilters} />
      </section>
    </div>
  );
};
