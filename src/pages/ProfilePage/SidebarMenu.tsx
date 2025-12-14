import { Link, useLocation } from "react-router-dom";
import styles from "./profilePage.module.scss";

import {
  Request,
  MessageText,
  IdeaLK,
  Like,
  User,
} from "@/shared/ui/DecoratedButton/svg/IconSvg";

//тут нужно указать, куда кнопки переходят - но также тут должны быть заглушки
//в нашем случае активные кнопки это Избранное, вроде Мои навыки и Личные данные
export const SidebarMenu = () => {
  //определяем активный рункт меню
  const location = useLocation();
  const isFavorites = location.pathname === "/favorites";
  const isProfile = location.pathname === "/profile";
  const isSkills = location.pathname === "/skills";
  const isExchanges = location.pathname === "/exchanges";
  const isRequests = location.pathname === "/requests";

  return (
    <aside>
      <div className={styles.sidebarBackground}>
        <nav className={styles.menu} role="navigation">
          {/* TODO: заменить на реальные пути когда будут готовы компоненты */}

          <Link
            to="/requests"
            className={isRequests ? styles.menuItemActive : styles.menuItem}
          >
            <Request />
            Заявки
          </Link>

          <Link
            to="/exchanges"
            className={isExchanges ? styles.menuItemActive : styles.menuItem}
          >
            <MessageText />
            Мои обмены
          </Link>

          <Link
            to="/skills"
            className={isSkills ? styles.menuItemActive : styles.menuItem}
          >
          
            <IdeaLK />
            Мои навыки
          </Link>

          <Link
            to="/favorites"
            className={isFavorites ? styles.menuItemActive : styles.menuItem}
          >
            <Like />
            Избранное
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
