import styles from "./header.module.scss";
import { Link } from "react-router-dom";
import { Logo } from "../../shared/ui/logo/logo.tsx";
import { Button } from "../../shared/ui/button";
import clsx from "clsx";

export const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.navigation} aria-label="main navigation">
        <Link to="/" className={styles.navLink}>
          <Logo />
        </Link>

        <ul className={styles.navigationLinkContainer}>
          <li>
            <Link to="/" className={styles.navigationLink}>
              О проекте
            </Link>
          </li>

          {/* // TODO: Заменить navigationDropDownLink на компонент DropdownMenu, когда он будет готов */}
          <li>
            <Link
              to="/"
              className={clsx(
                styles.navigationDropDownLink,
                styles.navigationLink,
              )}
            >
              Все навыки
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.search}>
        <Link to="/favorites" className={styles.navLink}>
          <input
            type="text"
            placeholder={"Искать навык"}
            className={styles.input}
          />
        </Link>
      </div>

      {/* // TODO: Заменить на компонент кнопки переключения светлой/темной темы */}
      <button className={styles.themeToggle}>
        <div className={styles.themeIcon}></div>
      </button>

      <div className={styles.authButtons}>
        <Link to="/login" className={styles.navLink}>
          <Button children={"Войти"} variant="secondary"></Button>
        </Link>

        <Link to="/login" className={styles.navLink}>
          <Button children={"Зарегистрироваться"}></Button>
        </Link>
      </div>
    </header>
  );
};
