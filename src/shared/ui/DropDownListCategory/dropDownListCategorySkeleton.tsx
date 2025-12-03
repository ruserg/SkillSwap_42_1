import styles from "./dropDownListCategory.module.scss";

const DropDownListCategorySkeleton = () => {
  return (
    <div className={styles.listCategory}>
      {[...Array(6)].map((_, index) => (
        <div key={index} className={styles.itemCategoryContainer}>
          <div className={`${styles.imageSkeleton} ${styles.skeleton}`} />
          <div className={styles.itemsCategory}>
            <div className={`${styles.titleSkeleton} ${styles.skeleton}`} />
            <ul className={styles.itemsCategoryList}>
              {[...Array(6)].map((_, subIndex) => (
                <li key={subIndex} className={styles.subcategoriesTitle}>
                  <div
                    className={`${styles.linkSkeleton} ${styles.skeleton}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DropDownListCategorySkeleton;
