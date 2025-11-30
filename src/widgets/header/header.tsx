import styles from "./header.module.scss";
import { Link } from "react-router-dom";
import { Logo } from "@shared/ui/logo/logo.tsx";
import { Button } from "@shared/ui/button";
import clsx from "clsx";
import { Input } from "@shared/ui/input";
import { DecoratedButton } from "@shared/ui/decoratedButton/decoratedButton.tsx";

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
        <Input type={"search"} />
      </div>

      <DecoratedButton variant={"moon"} />

      <div className={styles.authButtons}>
        <Link to="/login" className={styles.navLink}>
          <Button children={"Войти"} variant="secondary"></Button>
        </Link>

        <Link to="/registration/step1" className={styles.navLink}>
          <Button children={"Зарегистрироваться"}></Button>
        </Link>
      </div>
    </header>
  );
};
