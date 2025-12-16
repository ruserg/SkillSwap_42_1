import styles from "./favoritesPage.module.scss";
import { SidebarMenu } from "@pages/ProfilePage/SidebarMenu";
import { Favorites } from "./Favorites";

export const FavoritesPage = () => {
  return (
    <div className={styles.wrapper}>
      {/* левое меню как в профиле */}
      <SidebarMenu />

      {/* правый компонент - избранное */}
      <div className={styles.content}>
        <div className={styles.favoritesContainer}>
          <Favorites />
        </div>
      </div>
    </div>
  );
};
