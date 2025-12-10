import styles from "./layout.module.scss";
import { Outlet } from "react-router-dom";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { Toast } from "../Toast/Toast";

export const Layout = () => (
  <div className={styles.pageContainer}>
    <Header />
    <main id="main-content" role="main" className={styles.main}>
      <Outlet />
    </main>
    <Footer />
    <Toast />
  </div>
);
