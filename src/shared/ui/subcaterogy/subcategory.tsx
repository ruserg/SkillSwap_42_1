import styles from "./subcategory.module.scss";
import type { SubcategoryUIProps } from "./type";

//В компонент передается название подкатегории и id категории для определния цвета
//Если будет больше 2 навыков, в компоненте юзера где-то будет указываться класс
//tag-plus

export const SubcategoryUI = ({ name, categoryId }: SubcategoryUIProps) => {
  const getCategoryClass = (catId: number) => {
    const categoryClassMap: Record<number, string> = {
      1: styles["creativity-art"],
      2: styles["foreign-languages"],
      3: styles["business-career"],
      4: styles["education-development"],
      5: styles["home-comfort"],
      6: styles["health-lifestyle"],
    };

    return categoryClassMap[catId] || styles["tag-plus"];
  };

  const backgroundClass = getCategoryClass(categoryId);

  return (
    <span className={`${styles.subcategory} ${backgroundClass}`}>{name}</span>
  );
};
