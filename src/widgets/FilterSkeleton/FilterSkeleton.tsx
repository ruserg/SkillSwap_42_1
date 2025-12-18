import styles from "./filterSkeleton.module.scss";

export const FilterSkeleton = () => {
  return (
    <div className={styles.filterColumn}>
      <div className={styles.filterColumnTitle}>
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
      </div>
      <ul className={styles.filterContainer}>
        {/* Секция "Назначение" */}
        <li className={styles.filterSection}>
          <div
            className={`${styles.skeleton} ${styles.skeletonSectionTitle}`}
          />
          <ul className={styles.filterList}>
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className={styles.filterItem}>
                <div className={`${styles.skeleton} ${styles.skeletonRadio}`} />
              </li>
            ))}
          </ul>
        </li>

        {/* Секция "Навыки" */}
        <li className={styles.filterSection}>
          <div
            className={`${styles.skeleton} ${styles.skeletonSectionTitle}`}
          />
          <ul className={styles.filterList}>
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className={styles.filterItem}>
                <div
                  className={`${styles.skeleton} ${styles.skeletonCheckbox}`}
                />
              </li>
            ))}
          </ul>
        </li>

        {/* Секция "Пол автора" */}
        <li className={styles.filterSection}>
          <div
            className={`${styles.skeleton} ${styles.skeletonSectionTitle}`}
          />
          <ul className={styles.filterList}>
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className={styles.filterItem}>
                <div className={`${styles.skeleton} ${styles.skeletonRadio}`} />
              </li>
            ))}
          </ul>
        </li>

        {/* Секция "Город" */}
        <li className={styles.filterSection}>
          <div
            className={`${styles.skeleton} ${styles.skeletonSectionTitle}`}
          />
          <ul className={styles.filterList}>
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className={styles.filterItem}>
                <div
                  className={`${styles.skeleton} ${styles.skeletonCheckbox}`}
                />
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};
