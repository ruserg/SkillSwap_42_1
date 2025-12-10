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
            <Link to="/">О проекте</Link>
          </li>

          <li>
            <Link to="/">Контакты</Link>
          </li>

          <li>
            <Link to="/">Политика конфиденциальности</Link>
          </li>

          <li>
            <Link to="/">Все навыки</Link>
          </li>

          <li>
            <Link to="/">Блог</Link>
          </li>

          <li>
            <Link to="/">Пользовательское соглашение</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};
