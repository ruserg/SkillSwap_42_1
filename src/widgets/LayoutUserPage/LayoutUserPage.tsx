import { SidebarMenu } from "@/pages/ProfilePage/SidebarMenu";
import { Outlet } from "react-router-dom";
import styles from "./layoutUserPage.module.scss";

export const LayoutUserPage = () => {
  return (
    <div className={styles.layoutUserPage}>
      <SidebarMenu />
      <div className={styles.outletWrapper}>
        <Outlet />
      </div>
    </div>
  );
};
