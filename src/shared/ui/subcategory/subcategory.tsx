import styles from "./subcategory.module.scss";
import type { SubcategoryUIProps } from "./type";

//В компонент передается название подкатегории и id категории для определния цвета
//Если будет больше 2 навыков, в компоненте юзера где-то будет указываться класс
//tag-plus

export const SubcategoryUI = ({ name, categoryId }: SubcategoryUIProps) => {
  const getCategoryClass = (catId: number) => {
    const categoryClassMap: Record<number, string> = {
      1: styles["creativityArt"],
      2: styles["foreignLanguages"],
      3: styles["businessCareer"],
      4: styles["educationDevelopment"],
      5: styles["homeComfort"],
      6: styles["healthLifestyle"],
    };

    return categoryClassMap[catId] || styles["tagPlus"];
  };

  const backgroundClass = getCategoryClass(categoryId);

  return (
    <span className={`${styles.subcategory} ${backgroundClass}`}>{name}</span>
  );
};
