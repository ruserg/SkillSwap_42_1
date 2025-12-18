import styles from "./styles/radioSvg.module.scss";

export const RadioEmpty = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className={styles.radioEmpty}
  >
    <path
      className={styles.radioEmptyPath}
      fill="#253017"
      d="M12 22C6.484 22 2 17.516 2 12S6.484 2 12 2s10 4.484 10 10-4.484 10-10 10m0-18.605c-4.744 0-8.605 3.86-8.605 8.605 0 4.744 3.86 8.605 8.605 8.605 4.744 0 8.605-3.86 8.605-8.605 0-4.744-3.86-8.605-8.605-8.605"
    />
  </svg>
);

export const RadioActive = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className={styles.radioActive}
  >
    <path
      className={styles.radioActivePath}
      fill="#508826"
      d="M12 22C6.484 22 2 17.516 2 12S6.484 2 12 2s10 4.484 10 10-4.484 10-10 10m0-18.605c-4.744 0-8.605 3.86-8.605 8.605 0 4.744 3.86 8.605 8.605 8.605 4.744 0 8.605-3.86 8.605-8.605 0-4.744-3.86-8.605-8.605-8.605"
    />
    <circle
      cx="12"
      cy="12"
      r="5"
      fill="#508826"
      className={styles.radioActiveCircle}
    />
  </svg>
);
