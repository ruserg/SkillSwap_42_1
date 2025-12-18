import { Link, useLocation } from "react-router-dom";
import styles from "./profilePage.module.scss";
import {
  Request,
  MessageText,
  IdeaLK,
  Like,
  User,
} from "@/shared/ui/DecoratedButton/svg/IconSvg";

export const SidebarMenu = () => {
  const location = useLocation();
  const isFavorites = location.pathname === "/profile/favorites";
  const isProfile = location.pathname === "/profile";
  const isSkills = location.pathname === "/profile/skills";
  const isExchanges = location.pathname === "/profile/exchanges";
  const isRequests = location.pathname === "/profile/requests";

  return (
    <aside className={styles.sidebarWrapper}>
      <div className={styles.sidebarBackground}>
        <nav className={styles.menu} role="navigation">
          <Link
            to="/profile/requests"
            className={isRequests ? styles.menuItemActive : styles.menuItem}
          >
            <Request />
            Заявки
          </Link>

          <Link
            to="/profile/exchanges"
            className={isExchanges ? styles.menuItemActive : styles.menuItem}
          >
            <MessageText />
            Мои обмены
          </Link>

          <Link
            to="/profile/favorites"
            className={isFavorites ? styles.menuItemActive : styles.menuItem}
          >
            <Like />
            Избранное
          </Link>

          <Link
            to="/profile/skills"
            className={isSkills ? styles.menuItemActive : styles.menuItem}
          >
            <IdeaLK />
            Мои навыки
          </Link>

          <Link
            to="/profile"
            className={isProfile ? styles.menuItemActive : styles.menuItem}
          >
            <User />
            Личные данные
          </Link>
        </nav>
      </div>
    </aside>
  );
};
