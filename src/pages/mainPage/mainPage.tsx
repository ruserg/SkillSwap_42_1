import styles from "./mainPage.module.scss";
<<<<<<< HEAD
import { Header } from "@/widgets/Header/Header";
import { Footer } from "@widgets/Footer/Footer.tsx";
=======

import { Filter } from "@widgets/filter";
import { Header } from "@widgets/header/header.tsx";
import { Footer } from "@widgets/footer/footer.tsx";
>>>>>>> 5b845b2 (feat(mainPage): Доработал главную страницу;)

export const MainPage = () => {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <aside className={styles.filterContainer}>
          <Filter />
        </aside>
        <section className={styles.galleryContainer}>
          Секция для галереи карточек пользователей
        </section>
      </main>

      <Footer />
    </div>
  );
};
