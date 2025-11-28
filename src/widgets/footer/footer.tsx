import styles from "./footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      {/*временное лого, пока не сделал компонент*/}
      <div className={styles.footerLogoContainer}>
        <a href="" className={styles.linkContainer}>
          <img src="./logo.svg" alt="" className={styles.logoIcon} />{" "}
          {/* svg положила в Public для верстки*/}
          <span className={styles.titleLogo}>SkillSwap</span>
        </a>
        <span className={styles.subtitleLogo}>
          SkillSwap - {new Date().getFullYear()}
        </span>
      </div>
      {/*временное лого, пока не сделал компонент*/}
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
