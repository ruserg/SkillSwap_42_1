import styles from "./styles/app.module.scss";
import { Outlet } from "react-router-dom";
import { OfferPreview } from "@widgets/OfferPreview/OfferPreview.tsx";
import { Header } from "@widgets/header/header";
import { Footer } from "@widgets/Footer/Footer";

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
