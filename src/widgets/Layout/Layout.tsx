import styles from "./layout.module.scss";
import { Outlet } from "react-router-dom";
import { Footer } from "@widgets/Footer/Footer";
import { Header } from "@widgets/Header/Header";
import { Toast } from "@widgets/Toast/Toast";
import { useAppSelector } from "@/app/store/hooks";
import { selectCategoryData } from "@entities/category/model/slice";
import { useState } from "react";
import type { TFilterState } from "@/features/filter-users/types";

export const Layout = () => {
  const { subcategories } = useAppSelector(selectCategoryData);

  const [filters, setFilters] = useState<TFilterState>({
    purpose: "",
    skills: [],
    gender: "",
    cityAll: [],
  });

  return (
    <div className={styles.pageContainer}>
      <Header subcategories={subcategories} onFiltersChange={setFilters} />
      <main id="main-content" role="main" className={styles.main}>
        <Outlet context={{ filters, setFilters }} />
      </main>
      <Footer />
      <Toast />
    </div>
  );
};
