import styles from "./requestsPage.module.scss";
import { SidebarMenu } from "@pages/ProfilePage/SidebarMenu";
import { Requests } from "./Requests";

export const RequestsPage = () => {
  return (
    <div className={styles.wrapper}>
      <SidebarMenu />
      <div className={styles.content}>
        <div className={styles.requestsContainer}>
          <Requests />
        </div>
      </div>
    </div>
  );
};
