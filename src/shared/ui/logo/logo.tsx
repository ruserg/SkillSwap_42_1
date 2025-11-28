import styles from "./logo.module.scss";

export const Logo = () => {
  return (
    <>
      <a href="#" className={styles.logoLinkContainer}>
        <img src="./logo.svg" alt="Логотип сайта SkillSwap" />
        <span className={styles.logoTitle}>SkillSwap</span>
      </a>
    </>
  );
};
