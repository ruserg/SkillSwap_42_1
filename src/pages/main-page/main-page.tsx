import styles from "./main-page.module.scss";
import { Header } from "@widgets/header/header.tsx";
import { Footer } from "@widgets/footer/footer.tsx";

export const MainPage = () => {
  return (
    <div className={styles.page}>
      <Header />

      <aside className={styles.filterContainer}>
        Секция для фильтров категорий
      </aside>
      <main className={styles.main}>
        <section className={styles.galleryContainer}>
          Секция для галереи карточек пользователей
        </section>
      </main>

      <Footer />
    </div>
  );
};
