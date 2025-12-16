import { Button } from "@shared/ui/Button/Button";
import styles from "./errorPage.module.scss";
import type { errorPropsType } from "./errorPage.types";
import { useNavigate } from "react-router-dom";

export const ErrorPage = (props: errorPropsType) => {
  const { statusCode } = props;
  const navigate = useNavigate();

  const errorTitle =
    statusCode === "404"
      ? "Страница не найдена"
      : "На сервере произошла ошибка";
  const errorDescription =
    statusCode === "404"
      ? "К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже"
      : "Попробуйте позже или вернитесь на главную страницу";

  return (
    <div className={styles.errorWrapper}>
      <div className={styles.errorPage} data-error={statusCode}>
        <div
          className={styles.errorImage}
          role="img"
          aria-label={statusCode === "404" ? "ошибка 404" : "ошибка 500"}
        ></div>
        <div className={styles.errorContainer}>
          <div className={styles.errorInfo}>
            <h1 className={styles.errorTitle}>{errorTitle}</h1>
            <p className={styles.errorDescription}>{errorDescription}</p>
          </div>
          <div className={styles.errorButtons}>
            <Button variant="secondary" onClick={() => {}}>
              Сообщить об ошибке
            </Button>
            <Button onClick={() => navigate("/", { replace: true })}>
              На главную
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
