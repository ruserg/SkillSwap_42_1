import styles from "./successMessage.module.scss";
import clsx from "clsx";
import type { TSuccessMessageProps } from "@shared/ui/SuccessMessage/types";
import { SuccessIcon } from "@shared/ui/Icons/SuccessIcon";
import { NotificationIcon } from "@shared/ui/Icons/NotificationIcon";
import { Button } from "@shared/ui/Button/Button";

export const SuccessMessage = (props: TSuccessMessageProps) => {
  const {
    variant = "successMessage",
    className,
    children,
    title,
    description,
    buttonText = "Готово",
    onButtonClick,
  } = props;

  const defaultTitle =
    variant === "successMessage"
      ? "Ваше предложение создано"
      : "Вы предложили обмен";
  const defaultDescription =
    variant === "successMessage"
      ? "Теперь вы можете предложить обмен"
      : "Теперь дождитесь подтверждения. Вам придёт уведомление";

  return (
    <section className={clsx(styles.container, className)}>
      <div className={styles.containerIcon}>
        {variant === "successMessage" && <SuccessIcon />}
        {variant === "notificationMessage" && <NotificationIcon />}
      </div>
      <div className={clsx(styles.content, styles.scrollbar)}>
        {children ? (
          children
        ) : (
          <>
            <h2 className={styles.contentTitle}>{title || defaultTitle}</h2>
            <p className={styles.subTittle}>
              {description || defaultDescription}
            </p>
          </>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={onButtonClick}>{buttonText}</Button>
      </div>
    </section>
  );
};
