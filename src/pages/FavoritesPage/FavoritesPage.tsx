import styles from "./favoritesPage.module.scss";
import { Favorites } from "./Favorites";

export const FavoritesPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.favoritesContainer}>
          <Favorites />
        </div>
      </div>
    </div>
  );
};
