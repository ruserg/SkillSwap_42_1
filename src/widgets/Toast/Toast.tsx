import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { selectToast, clearToast } from "@entities/notification/model/slice";
import styles from "./toast.module.scss";

export const Toast = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(selectToast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) {
    return null;
  }

  const handleClose = () => {
    dispatch(clearToast());
  };

  return (
    <div className={styles.toastContainer}>
      <div className={styles.toast} role={"status"} aria-live={"polite"}>
        <div className={styles.toastContent}>
          <div className={styles.toastMessage}>{toast.message}</div>
          {toast.details && (
            <div className={styles.toastDetails}>{toast.details}</div>
          )}
        </div>
        <button
          className={styles.toastClose}
          onClick={handleClose}
          aria-label="Закрыть уведомление"
        >
          ×
        </button>
      </div>
    </div>
  );
};
