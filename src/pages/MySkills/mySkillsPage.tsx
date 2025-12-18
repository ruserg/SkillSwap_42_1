import styles from "./mySkillsPage.module.scss";
import { MySkills } from "./MySkills";

export const MySkillsPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.skillsContainer}>
          <MySkills />
        </div>
      </div>
    </div>
  );
};
