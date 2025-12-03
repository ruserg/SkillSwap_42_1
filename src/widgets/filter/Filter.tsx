import {
  useState,
  useEffect,
  type ChangeEvent,
  type ReactElement,
} from "react";
import { Input } from "@shared/ui/Input";
import styles from "./filter.module.scss";
import { FILTER_CONFIG, type TFilterState } from "./filter.type";
import { ClearSVG } from "./svg/ClearSvg";
import chevronUp from "@images/icons/chevron-up.svg";
import chevronDown from "@images/icons/chevron-down.svg";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  fetchReferenceData,
  selectReferenceData,
} from "@store/slices/referenceDataSlice";
import { FilterSkeleton } from "@widgets/FilterSkeleton/FilterSkeleton";

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
  const { categories, subcategories, cities, isLoading } =
    useAppSelector(selectReferenceData);

  const purpose = ["Всё", "Хочу научиться", "Хочу научить"];
  const categorys = categories;
  const subcategorys = subcategories;
  const gender = ["Не имеет значения", "Мужчины", "Женщины"];
  const citys = cities;

  useEffect(() => {
    if (categories.length === 0 && !isLoading) {
      dispatch(fetchReferenceData());
    }
  }, [dispatch, categories.length, isLoading]);

  const [showSubcategorys, setShowSubcategorys] = useState<number[]>([]);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);

  const displayedSkills = showAllSkills
    ? categorys
    : categorys.slice(0, FILTER_CONFIG.SKILLS_VISIBLE_COUNT);
  const displayedCities = showAllCities
    ? citys
    : citys.slice(0, FILTER_CONFIG.CITIES_VISIBLE_COUNT);

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
    filters.citys.length;

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

  const handleCategoriesChange = (categoryId: number) => {
    toggleCategory(categoryId);
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

  const handleCitysChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedCitysId = Number(event.target.value);
    onFiltersChange({
      ...filters,
      citys: filters.citys.includes(selectedCitysId)
        ? filters.citys.filter((city) => city !== selectedCitysId)
        : [...filters.citys, selectedCitysId],
    });
  };

  const handleClearFilter = () => {
    onFiltersChange({
      purpose: "",
      skills: [],
      gender: "",
      citys: [],
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
          <button className={styles.clearButton} onClick={handleClearFilter}>
            Сбросить
            <ClearSVG className={styles.clearButtonSVG} />
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
                    checked={showSubcategorys.includes(category.id)}
                    onChange={() => handleCategoriesChange(category.id)}
                  />
                  <button onClick={() => toggleCategory(category.id)}>
                    <img
                      src={
                        showSubcategorys.includes(category.id)
                          ? chevronUp
                          : chevronDown
                      }
                      alt={`иконка стрелочки ${showSubcategorys.includes(category.id) ? "Вверх" : "Вниз"}`}
                    />
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
                >
                  {showAllSkills ? "Скрыть" : "Все категории"}
                  <img
                    src={showAllSkills ? chevronUp : chevronDown}
                    alt={`иконка стрелочки ${showAllSkills ? "Вверх" : "Вниз"}`}
                  />
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
        <li className={styles.filterCitys}>
          <h3 className={styles.filterOtherTitle}>Город</h3>
          <ul className={styles.filterCheckbox}>
            {displayedCities.map((city) => (
              <li className={styles.filterCitysItems} key={city.id}>
                <Input
                  type="checkbox"
                  children={city.name}
                  isOpenList
                  value={String(city.id)}
                  checked={filters.citys.includes(city.id)}
                  onChange={handleCitysChange}
                />
              </li>
            ))}
            {citys.length > 5 && (
              <li>
                <button
                  className={styles.showAllButton}
                  onClick={toggleShowAllCities}
                >
                  {showAllCities ? "Скрыть" : "Все города"}
                  <img
                    src={showAllCities ? chevronUp : chevronDown}
                    alt={`иконка стрелочки ${showAllCities ? "Вверх" : "Вниз"}`}
                  />
                </button>
              </li>
            )}
          </ul>
        </li>
      </ul>
    </div>
  );
};
