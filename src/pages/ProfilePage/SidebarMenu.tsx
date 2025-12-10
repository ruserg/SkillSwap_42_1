import styles from "./profilePage.module.scss";
import requestIcon from "@images/icons/request.svg?url";
import messageTextIcon from "@images/icons/message-text.svg?url";
import likeIcon from "@images/icons/like.svg?url";
import ideaIcon from "@images/icons/idea.svg?url";
import userIcon from "@images/icons/user.svg?url";

//тут нужно указать, куда кнопки переходят - но также тут должны быть заглушки
//в нашем случае активные кнопки это Избранное, вроде Мои навыки и Личные данные
export const SidebarMenu = () => {
  return (
    <aside>
      <div className={styles.sidebarBackground}>
        <nav className={styles.menu} role="navigation">
          <a className={styles.menuItem}>
            <img src={requestIcon} alt="Заявки" width={24} height={24} />
            Заявки
          </a>
          <a className={styles.menuItem}>
            <img
              src={messageTextIcon}
              alt="Мои обмены"
              width={24}
              height={24}
            />
            Мои обмены
          </a>
          <a className={styles.menuItem}>
            <img src={likeIcon} alt="Избранное" width={24} height={24} />
            Избранное
          </a>
          <a className={styles.menuItem}>
            <img src={ideaIcon} alt="Мои навыки" width={24} height={24} />
            Мои навыки
          </a>
          <a className={styles.menuItemActive}>
            <img src={userIcon} alt="Личные данные" width={24} height={24} />
            Личные данные
          </a>
        </nav>
      </div>
    </aside>
  );
};
