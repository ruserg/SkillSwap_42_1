import styles from "./skillEditPage.module.scss";
import { SkillForm } from "@features/skills/ui/SkillForm/SkillForm";

export const SkillEditPage = () => {
  return (
    <div className={styles.wrapper}>
      <SkillForm />
    </div>
  );
};
