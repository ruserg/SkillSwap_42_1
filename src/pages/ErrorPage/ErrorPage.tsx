import { Button } from "@shared/ui/Button/Button";
import styles from "./errorPage.module.scss";
import type { errorPropsType } from "./errorPage.types";
import { useNavigate } from "react-router-dom";

export const ErrorPage = (props: errorPropsType) => {
  const {
    statusCode,
    title,
    description,
    children,
    buttonText = "На главную",
    onButtonClick,
    showReportButton = true,
    reportButtonText = "Сообщить об ошибке",
    onReportClick,
  } = props;
  const navigate = useNavigate();

  const defaultTitle =
    statusCode === "404"
      ? "Страница не найдена"
      : "На сервере произошла ошибка";
  const defaultDescription =
    statusCode === "404"
      ? "К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже"
      : "Попробуйте позже или вернитесь на главную страницу";

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className={styles.errorWrapper}>
      <div className={styles.errorPage} data-error={statusCode}>
        <div
          className={styles.errorImage}
          role="img"
          aria-label={statusCode === "404" ? "ошибка 404" : "ошибка 500"}
        ></div>
        <div className={styles.errorContainer}>
          {children ? (
            children
          ) : (
            <div className={styles.errorInfo}>
              <h1 className={styles.errorTitle}>{title || defaultTitle}</h1>
              <p className={styles.errorDescription}>
                {description || defaultDescription}
              </p>
            </div>
          )}
          <div className={styles.errorButtons}>
            {showReportButton && (
              <Button variant="secondary" onClick={onReportClick || (() => {})}>
                {reportButtonText}
              </Button>
            )}
            <Button onClick={handleButtonClick}>{buttonText}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
