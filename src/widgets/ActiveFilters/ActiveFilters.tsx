import { useMemo } from "react";
import type { TFilterState } from "@features/filter-users/types";
import type { TSubcategory } from "@entities/category/types";
import type { TCity } from "@entities/city/types";
import styles from "./activeFilters.module.scss";

interface ActiveFiltersProps {
  filters: TFilterState;
  subcategories: TSubcategory[];
  cities: TCity[];
  onFiltersChange: (filters: TFilterState) => void;
}

export const ActiveFilters = ({
  filters,
  subcategories,
  cities,
  onFiltersChange,
}: ActiveFiltersProps) => {
  const activeFilterTags = useMemo(() => {
    const tags: Array<{
      id: string;
      label: string;
      type: string;
      value: string | number;
    }> = [];

    if (filters.purpose !== "" && filters.purpose !== "Всё") {
      tags.push({
        id: `purpose-${filters.purpose}`,
        label: filters.purpose,
        type: "purpose",
        value: filters.purpose,
      });
    }

    filters.skills.forEach((subcategoryId) => {
      const subcategory = subcategories.find((sub) => sub.id === subcategoryId);
      if (subcategory) {
        tags.push({
          id: `skill-${subcategoryId}`,
          label: subcategory.name,
          type: "skill",
          value: subcategoryId,
        });
      }
    });

    if (filters.gender !== "" && filters.gender !== "Не имеет значения") {
      tags.push({
        id: `gender-${filters.gender}`,
        label: filters.gender,
        type: "gender",
        value: filters.gender,
      });
    }

    filters.cityAll.forEach((cityId) => {
      const city = cities.find((c) => c.id === cityId);
      if (city) {
        tags.push({
          id: `city-${cityId}`,
          label: city.name,
          type: "city",
          value: cityId,
        });
      }
    });

    return tags;
  }, [filters, subcategories, cities]);

  const handleRemoveFilter = (type: string, value: string | number) => {
    const newFilters = { ...filters };

    switch (type) {
      case "purpose":
        newFilters.purpose = "";
        break;
      case "skill":
        newFilters.skills = newFilters.skills.filter((id) => id !== value);
        break;
      case "gender":
        newFilters.gender = "";
        break;
      case "city":
        newFilters.cityAll = newFilters.cityAll.filter((id) => id !== value);
        break;
    }

    onFiltersChange(newFilters);
  };

  if (activeFilterTags.length === 0) {
    return null;
  }

  return (
    <div className={styles.filterTags}>
      {activeFilterTags.map((tag) => (
        <button
          key={tag.id}
          className={styles.filterTag}
          onClick={() => handleRemoveFilter(tag.type, tag.value)}
        >
          <span className={styles.filterTagText}>{tag.label}</span>
          <span className={styles.filterTagIcon}>
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L10 10M10 1L1 10"
                stroke="var(--color-text)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      ))}
    </div>
  );
};
