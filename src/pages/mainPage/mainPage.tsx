import styles from "./mainPage.module.scss";
import { Header } from "@/widgets/Header/Header";
import { Footer } from "@widgets/Footer/Footer.tsx";

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
