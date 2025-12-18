import styles from "./footer.module.scss";
import { Logo } from "@shared/ui/Logo/Logo";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer role="contentinfo" className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLogoContainer}>
          <Logo />
          <span className={styles.subtitleLogo}>
            SkillSwap - {new Date().getFullYear()}
          </span>
        </div>
        <ul className={styles.footerLinks}>
          <li>
            <Link to="/about">О проекте</Link>
          </li>

          <li>
            <Link to="/contacts">Контакты</Link>
          </li>

          <li>
            <Link to="/privacy">Политика конфиденциальности</Link>
          </li>

          <li>
            <Link to="/">Все навыки</Link>
          </li>

          <li>
            <Link to="/blog">Блог</Link>
          </li>

          <li>
            <Link to="/terms">Пользовательское соглашение</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};
