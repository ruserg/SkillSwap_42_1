import { useSelector } from "react-redux";
import styles from "./dropDownListCategory.module.scss";
import { selectCategoryData } from "@entities/category/model/slice";
import bussinessCareerImg from "@images/png/Business-career.png";
import creativeAndArtImg from "@images/png/Creativity-and-Art.png";
import educationAndDevelopmentImg from "@images/png/Education-and-Development.png";
import foreignLanguagesImg from "@images/png/Foreig-languages.png";
import healthAndLifestyleImg from "@images/png/Health-and-Lifestyle.png";
import homeAndComfortImg from "@images/png/Home-and-comfort.png";
import DropDownListCategorySkeleton from "./DropDownListCategorySkeleton";

import type { TSubcategory } from "@/entities/category/types";

interface DropDownListCategoryProps {
  subcategories: TSubcategory[];
  onSubcategoryClick: (subcategoryId: number) => void;
}

export const DropDownListCategory = ({
  onSubcategoryClick,
}: DropDownListCategoryProps) => {
  const { categories, subcategories, isLoading } =
    useSelector(selectCategoryData);

  const setImagesCategory = (categoriesId: number) => {
    switch (categoriesId) {
      case 1:
        return bussinessCareerImg;
      case 2:
        return creativeAndArtImg;
      case 3:
        return foreignLanguagesImg;
      case 4:
        return educationAndDevelopmentImg;
      case 5:
        return homeAndComfortImg;
      case 6:
        return healthAndLifestyleImg;
    }
  };

  if (isLoading) {
    return <DropDownListCategorySkeleton />;
  }

  return (
    <div
      className={styles.listCategory}
      role="list"
      aria-label="Категории навыков"
    >
      {categories.map((category) => (
        <div
          key={category.id}
          className={styles.itemCategoryContainer}
          aria-label={`Категория: ${category.name}`}
        >
          <img
            src={setImagesCategory(category.id)}
            alt={category.name}
            aria-hidden="true"
          />
          <div className={styles.itemsCategory}>
            <h3 className={styles.itemsCategoryTitle}>{category.name}</h3>
            <ul className={styles.itemsCategoryList}>
              {subcategories
                .filter((subcategory) => subcategory.categoryId === category.id)
                .map((subcategory) => (
                  <li
                    key={subcategory.id}
                    className={styles.subcategoriesTitle}
                  >
                    <button
                      type="button"
                      className={styles.subcategoriesTitleButton}
                      onClick={() => onSubcategoryClick?.(subcategory.id)}
                    >
                      {subcategory.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
