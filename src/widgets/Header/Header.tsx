import styles from "./header.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Logo } from "@shared/ui/Logo/Logo";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import { DecoratedButton } from "@shared/ui/DecoratedButton/DecoratedButton";

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
