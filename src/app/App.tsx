import styles from "./styles/app.module.scss";
import { Outlet } from "react-router-dom";
import { Footer } from "../widgets/Footer/Footer";
import { Header } from "../widgets/Header/Header";

// type AppProps = {
//   title?: string;
// };

export default function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
