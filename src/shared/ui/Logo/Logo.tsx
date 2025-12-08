import styles from "./logo.module.scss";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link
      to="/"
      className={styles.logoLinkContainer}
      aria-label={"Перейти на главную страницу"}
    >
      <img src="/logo.svg" alt="Логотип сайта SkillSwap" />
      <span className={styles.logoTitle}>SkillSwap</span>
    </Link>
  );
};
