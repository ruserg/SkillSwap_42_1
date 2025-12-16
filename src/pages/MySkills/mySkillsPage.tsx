import styles from "./mySkillsPage.module.scss";
import { SidebarMenu } from "@pages/ProfilePage/SidebarMenu";
import { MySkills } from "./MySkills";

export const MySkillsPage = () => {
  return (
    <div className={styles.wrapper}>
      {/* левое меню как в профиле */}
      <SidebarMenu />

      {/* правый компонент - мои навыки */}
      <div className={styles.content}>
        <div className={styles.skillsContainer}>
          <MySkills />
        </div>
      </div>
    </div>
  );
};
