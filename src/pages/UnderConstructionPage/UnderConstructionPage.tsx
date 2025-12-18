import { Button } from "@shared/ui/Button/Button";
import styles from "./underConstructionPage.module.scss";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface UnderConstructionPageProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const UnderConstructionPage = ({
  title = "Страница в разработке",
  description = "Мы работаем над этой страницей. Скоро здесь появится что-то интересное!",
  children,
  buttonText = "На главную",
  onButtonClick,
}: UnderConstructionPageProps = {}) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className={styles.constructionWrapper}>
      <div className={styles.constructionPage}>
        <div className={styles.constructionContainer}>
          {children ? (
            children
          ) : (
            <div className={styles.constructionInfo}>
              <h1 className={styles.constructionTitle}>{title}</h1>
              <p className={styles.constructionDescription}>{description}</p>
            </div>
          )}
          <div className={styles.constructionButtons}>
            <Button onClick={handleButtonClick}>{buttonText}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
