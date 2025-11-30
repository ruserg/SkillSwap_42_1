import { useState, type ChangeEvent } from "react";
import { Input } from "@/shared/ui/input";
import styles from "./filter.module.scss";
import { FILTER_CONFIG, type TFilterState } from "./filter.type";
import { ClearSVG } from "./svg/ClearSvg";
import chevronUp from "@images/icons/chevron-up.svg";
import chevronDown from "@images/icons/chevron-down.svg";
import categoriesData from "../../../public/db/categories.json";
import subcategorysData from "../../../public/db/subcategories.json";
import citiesData from "../../../public/db/cities.json";

//На текущий момент, данные тащу прям из public/db
export const Filter = () => {
  const purpose = ["Всё", "Хочу научиться", "Хочу научить"];
  const categorys = categoriesData;
  const subcategorys = subcategorysData;
  const gender = ["Не имеет значения", "Мужчины", "Женщины"];
  const citys = citiesData.cities;

  const [filters, setFilters] = useState<TFilterState>({
    purpose: "",
    skills: [],
    gender: "",
    citys: [],
  });

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
    setFilters((prevFilters) => ({
      ...prevFilters,
      purpose: selectedPurpose,
    }));
  };

  const handleCategoriesChange = (categoryId: number) => {
    toggleCategory(categoryId);
  };

  const handleSubcategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const subcategoryId = Number(event.target.value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      skills: prevFilters.skills.includes(subcategoryId)
        ? prevFilters.skills.filter(
            (subcategory) => subcategory !== subcategoryId,
          )
        : [...prevFilters.skills, subcategoryId],
    }));
  };

  const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedGender = event.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      gender: selectedGender,
    }));
  };

  const handleCitysChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedCitysId = Number(event.target.value);
    setFilters((prevFilter) => ({
      ...prevFilter,
      citys: prevFilter.citys.includes(selectedCitysId)
        ? prevFilter.citys.filter((city) => city !== selectedCitysId)
        : [...prevFilter.citys, selectedCitysId],
    }));
  };

  const handleClearFilter = () => {
    setFilters({
      purpose: "",
      skills: [],
      gender: "",
      citys: [],
    });
  };

  return (
    <div className={styles.filterColumn}>
      <h2 className={styles.filterColumnTitle}>
        Фильтры {selectedFilterCounts > 0 && `(${selectedFilterCounts})`}
        {selectedFilterCounts > 0 && (
          <button className={styles.clearButton} onClick={handleClearFilter}>
            Сбросить
            <ClearSVG className={styles.clearButtonSVG} />
          </button>
        )}
      </h2>
      <div className={styles.filterContainer}>
        <div className={styles.filterRadio}>
          {purpose.map((item) => (
            <Input
              type="radio"
              name="purpose"
              children={item}
              key={item}
              value={item}
              checked={filters.purpose === item}
              onChange={handlePurposeChange}
            />
          ))}
        </div>
        <div className={styles.filterSkills}>
          <h3 className={styles.filterOtherTitle}>Навыки</h3>
          <div className={styles.filterCheckbox}>
            {displayedSkills.map((category) => (
              <div className={styles.filterCheckboxContainer} key={category.id}>
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
                  <div className={styles.filterCheckboxList}>
                    {getSubcategoriesForCategory(category.id).map((sub) => (
                      <Input
                        type="checkbox"
                        children={sub.name}
                        key={sub.id}
                        value={String(sub.id)}
                        checked={filters.skills.includes(sub.id)}
                        onChange={handleSubcategoryChange}
                        isOpenList
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {categorys.length > 5 && (
              <button
                className={styles.showAllButton}
                onClick={toggleShowAllSkills}
              >
                {showAllSkills ? "Скрыть" : "Все категории"}
                <img
                  src={showAllSkills ? chevronUp : chevronDown}
                  alt={`иконка стрелочки ${showAllSkills ? "Вверх" : "Вниз"}`}
                />
              </button>
            )}
          </div>
        </div>
        <div className={styles.filterGender}>
          <h3 className={styles.filterOtherTitle}>Пол автора</h3>
          <div className={styles.filterRadio}>
            {gender.map((item) => (
              <Input
                type="radio"
                name="gender"
                children={item}
                key={item}
                value={item}
                checked={filters.gender === item}
                onChange={handleGenderChange}
              />
            ))}
          </div>
        </div>
        <div className={styles.filterCitys}>
          <h3 className={styles.filterOtherTitle}>Город</h3>
          <div className={styles.filterCheckbox}>
            {displayedCities.map((city) => (
              <Input
                type="checkbox"
                children={city.name}
                isOpenList
                key={city.id}
                value={String(city.id)}
                checked={filters.citys.includes(city.id)}
                onChange={handleCitysChange}
              />
            ))}
            {citys.length > 5 && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
