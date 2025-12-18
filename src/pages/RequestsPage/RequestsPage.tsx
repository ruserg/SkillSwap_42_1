import styles from "./requestsPage.module.scss";
import { Requests } from "./Requests";

export const RequestsPage = () => {
  return (
    <div className={styles.requestsContainer}>
      <Requests />
    </div>
  );
};
