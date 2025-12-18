import styles from "./profilePage.module.scss";
import { ProfileForm } from "./ProfileForm";

export const ProfilePage = () => {
  return (
    <div className={styles.wrapper}>
      <ProfileForm />
    </div>
  );
};
