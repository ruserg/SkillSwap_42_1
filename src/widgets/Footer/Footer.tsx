import styles from "./footer.module.scss";
import { Logo } from "@shared/ui/Logo/Logo";

export const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerLogoContainer}>
        <Logo />
        <span className={styles.subtitleLogo}>
          SkillSwap - {new Date().getFullYear()}
        </span>
      </div>
      <ul className={styles.footerLinks}>
        <li>
          <a href="#">О проекте</a>
        </li>
        <li>
          <a href="#">Контакты</a>
        </li>
        <li>
          <a href="#">Политика конфиденциальности</a>
        </li>
        <li>
          <a href="#">Все навыки</a>
        </li>
        <li>
          <a href="#">Блог</a>
        </li>
        <li>
          <a href="#">Пользовательское соглашение</a>
        </li>
      </ul>
    </footer>
  );
};
