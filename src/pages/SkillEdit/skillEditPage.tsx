import styles from "./skillEditPage.module.scss";
import { SidebarMenu } from "@pages/ProfilePage/SidebarMenu";
import { SkillForm } from "@features/skills/ui/SkillForm/SkillForm";

export const SkillEditPage = () => {
  return (
    <div className={styles.wrapper}>
      {/* левое меню */}
      <SidebarMenu />

      {/* форма редактирования/создания навыка */}
      <SkillForm />
    </div>
  );
};
