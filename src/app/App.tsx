import styles from "./styles/app.module.scss";
import { Link, Outlet } from "react-router-dom";
import { Footer } from "../widgets/footer/footer.tsx";

type AppProps = {
  title?: string;
};

export default function App({ title = "SkillSwap" }: AppProps) {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          <Link to="/" className={styles.navLink}>
            {title}
          </Link>
        </h1>
        <nav className={styles.nav} aria-label="main navigation">
          <Link to="/" className={styles.navLink}>
            Главная
          </Link>
          <Link to="/profile" className={styles.navLink}>
            Профиль
          </Link>
          <Link to="/favorites" className={styles.navLink}>
            Избранное
          </Link>
          <Link to="/create-offer" className={styles.navLink}>
            Предложить обмен
          </Link>
          <Link to="/login" className={styles.navLink}>
            Войти
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} SkillSwap</span>
      </footer>
    </div>
  );
}

/*
<footer className={styles.footer}>
    <span>© {new Date().getFullYear()} SkillSwap</span>
</footer>*/
