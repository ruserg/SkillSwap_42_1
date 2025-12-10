import {
  useState,
  useEffect,
  type ChangeEvent,
  type ReactElement,
} from "react";
import { Input } from "@shared/ui/Input/Input";
import styles from "./filter.module.scss";
import { FILTER_CONFIG, type TFilterState } from "@features/filter-users/types";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import {
  fetchCategories,
  selectCategoryData,
} from "@entities/category/model/slice";
import { selectCities, fetchCities } from "@entities/city/model/slice";
import { FilterSkeleton } from "@widgets/FilterSkeleton/FilterSkeleton";
import { ClearSVG } from "./svg/FilterSvg";
import { Arrow } from "@/shared/ui/Arrow/Arrow";

interface FilterProps {
  filters: TFilterState;
  onFiltersChange: (filters: TFilterState) => void;
  onClearSearchQuery?: () => void;
}

export const Filter = ({
  filters,
  onFiltersChange,
  onClearSearchQuery,
}: FilterProps): ReactElement => {
  const dispatch = useAppDispatch();
  const { categories, subcategories, isLoading } =
    useAppSelector(selectCategoryData);
  const { cities } = useAppSelector(selectCities);

  const purpose = ["Всё", "Хочу научиться", "Хочу научить"];
  const categorys = categories;
  const subcategorys = subcategories;
  const gender = ["Не имеет значения", "Мужчины", "Женщины"];
  const cityAll = cities;

  useEffect(() => {
    if (categories.length === 0 && !isLoading) {
      dispatch(fetchCategories());
    }
    if (cities.length === 0) {
      dispatch(fetchCities());
    }
  }, [dispatch, categories.length, isLoading, cities.length]);

  const [showSubcategorys, setShowSubcategorys] = useState<number[]>([]);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);

  const displayedSkills = showAllSkills
    ? categorys
    : categorys.slice(0, FILTER_CONFIG.SKILLS_VISIBLE_COUNT);
  const displayedCities = showAllCities
    ? cityAll
    : cityAll.slice(0, FILTER_CONFIG.CITIES_VISIBLE_COUNT);

  const toggleCategory = (categoryId: number) => {
    setShowSubcategorys((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };
  const toggleShowAllSkills = () => setShowAllSkills(!showAllSkills);
  const toggleShowAllCities = () => setShowAllCities(!showAllCities);

  const selectedFilterCounts =
    (filters.purpose ? 1 : 0) +
    filters.skills.length +
    (filters.gender ? 1 : 0) +
    filters.cityAll.length;

  const getSubcategoriesForCategory = (categoryId: number) => {
    return subcategorys.filter((sub) => sub.categoryId === categoryId);
  };

  const handlePurposeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedPurpose = event.target.value;
    onFiltersChange({
      ...filters,
      purpose: selectedPurpose,
    });
  };

  const hasSelectedSubcategories = (categoryId: number) => {
    const categorySubcategories = getSubcategoriesForCategory(categoryId);
    const allSubcategoryIds = categorySubcategories.map((sub) => sub.id);
    return allSubcategoryIds.some((id) => filters.skills.includes(id));
  };

  const hasAllSelectedSubcategories = (categoryId: number) => {
    const categorySubcategories = getSubcategoriesForCategory(categoryId);
    const allSubcategoryIds = categorySubcategories.map((sub) => sub.id);
    return allSubcategoryIds.every((id) => filters.skills.includes(id));
  };

  const handleCategoryChange = (categoryId: number) => {
    const categorySubcategories = getSubcategoriesForCategory(categoryId);
    const allSubcategoryIds = categorySubcategories.map((sub) => sub.id);

    const hasAllSelected = allSubcategoryIds.every((id) =>
      filters.skills.includes(id),
    );

    let currentSkills: number[] = [];

    if (hasAllSelected) {
      currentSkills = filters.skills.filter(
        (id) => !allSubcategoryIds.includes(id),
      );
    } else {
      const missingSubcategoryIds = allSubcategoryIds.filter(
        (id) => !filters.skills.includes(id),
      );

      currentSkills = [...filters.skills, ...missingSubcategoryIds];
    }

    onFiltersChange({
      ...filters,
      skills: currentSkills,
    });
  };

  const handleSubcategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const subcategoryId = Number(event.target.value);
    onFiltersChange({
      ...filters,
      skills: filters.skills.includes(subcategoryId)
        ? filters.skills.filter((subcategory) => subcategory !== subcategoryId)
        : [...filters.skills, subcategoryId],
    });
  };

  const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedGender = event.target.value;
    onFiltersChange({
      ...filters,
      gender: selectedGender,
    });
  };

  const handleCityAllChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedCityAllId = Number(event.target.value);
    onFiltersChange({
      ...filters,
      cityAll: filters.cityAll.includes(selectedCityAllId)
        ? filters.cityAll.filter((city) => city !== selectedCityAllId)
        : [...filters.cityAll, selectedCityAllId],
    });
  };

  const handleClearFilter = () => {
    onFiltersChange({
      purpose: "",
      skills: [],
      gender: "",
      cityAll: [],
    });
    // Очищаем параметр q из URL
    if (onClearSearchQuery) {
      onClearSearchQuery();
    }
  };

  if (isLoading) {
    return <FilterSkeleton />;
  }

  return (
    <div className={styles.filterColumn}>
      <div className={styles.filterColumnTitle}>
        <h2 className={styles.filterTitle}>
          Фильтры {selectedFilterCounts > 0 && `(${selectedFilterCounts})`}
        </h2>
        {selectedFilterCounts > 0 && (
          <button
            className={styles.clearButton}
            onClick={handleClearFilter}
            type="button"
            aria-label="Сбросить все фильтры"
          >
            Сбросить
            <ClearSVG aria-hidden="true" />
          </button>
        )}
      </div>
      <ul className={styles.filterContainer}>
        <li className={styles.filterRadio}>
          <ul className={styles.filterPurpose}>
            {purpose.map((item) => (
              <li className={styles.filterPurposeItems} key={item}>
                <Input
                  type="radio"
                  name="purpose"
                  children={item}
                  value={item}
                  checked={filters.purpose === item}
                  onChange={handlePurposeChange}
                />
              </li>
            ))}
          </ul>
        </li>
        <li className={styles.filterSkills}>
          <h3 className={styles.filterOtherTitle}>Навыки</h3>
          <ul
            className={`${styles.filterCheckbox} ${
              showAllSkills ? styles.expanded : styles.collapsed
            }`}
          >
            {displayedSkills.map((category) => (
              <li className={styles.filterCheckboxContainer} key={category.id}>
                <div className={styles.filterCheckboxHeader}>
                  <Input
                    type="checkbox"
                    children={category.name}
                    value={String(category.id)}
                    checked={hasSelectedSubcategories(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    isOpenList={hasAllSelectedSubcategories(category.id)}
                    isBlockCheckedLabel
                    openListFunction={() => toggleCategory(category.id)}
                  />
                  <button
                    onClick={() => toggleCategory(category.id)}
                    type="button"
                    aria-label={
                      showSubcategorys.includes(category.id)
                        ? "Свернуть"
                        : "Развернуть"
                    }
                    aria-expanded={showSubcategorys.includes(category.id)}
                  >
                    <Arrow isOpen={showSubcategorys.includes(category.id)} />
                  </button>
                </div>
                {showSubcategorys.includes(category.id) && (
                  <ul className={styles.filterCheckboxList}>
                    {getSubcategoriesForCategory(category.id).map((sub) => (
                      <li className={styles.filterCheckboxItems} key={sub.id}>
                        <Input
                          type="checkbox"
                          children={sub.name}
                          value={String(sub.id)}
                          checked={filters.skills.includes(sub.id)}
                          onChange={handleSubcategoryChange}
                          isOpenList
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            {categorys.length >= FILTER_CONFIG.SKILLS_VISIBLE_COUNT && (
              <li>
                <button
                  className={styles.showAllButton}
                  onClick={toggleShowAllSkills}
                  type="button"
                  aria-label={
                    showAllSkills
                      ? "Скрыть все категории навыков"
                      : "Показать все категории навыков"
                  }
                  aria-expanded={showAllSkills}
                >
                  {showAllSkills ? "Скрыть" : "Все категории"}
                  <Arrow color="green" isOpen={showAllSkills} />
                </button>
              </li>
            )}
          </ul>
        </li>
        <li className={styles.filterGender}>
          <h3 className={styles.filterOtherTitle}>Пол автора</h3>
          <ul className={styles.filterRadio}>
            {gender.map((item) => (
              <li className={styles.filterGenderItems} key={item}>
                <Input
                  type="radio"
                  name="gender"
                  children={item}
                  value={item}
                  checked={filters.gender === item}
                  onChange={handleGenderChange}
                />
              </li>
            ))}
          </ul>
        </li>
        <li className={styles.filterCityAll}>
          <h3 className={styles.filterOtherTitle}>Город</h3>
          <ul className={styles.filterCheckbox}>
            {displayedCities.map((city) => (
              <li className={styles.filterCityAllItems} key={city.id}>
                <Input
                  type="checkbox"
                  children={city.name}
                  isOpenList
                  value={String(city.id)}
                  checked={filters.cityAll.includes(city.id)}
                  onChange={handleCityAllChange}
                />
              </li>
            ))}
            {cityAll.length > 5 && (
              <li>
                <button
                  className={styles.showAllButton}
                  onClick={toggleShowAllCities}
                  type="button"
                  aria-label={
                    showAllCities ? "Скрыть все города" : "Показать все города"
                  }
                  aria-expanded={showAllCities}
                >
                  {showAllCities ? "Скрыть" : "Все города"}
                  <Arrow color="green" isOpen={showAllCities} />
                </button>
              </li>
            )}
          </ul>
        </li>
      </ul>
    </div>
  );
};
