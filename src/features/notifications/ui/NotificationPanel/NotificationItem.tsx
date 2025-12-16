import React from "react";
import styles from "./notificationPanel.module.scss";
import { Button } from "@shared/ui/Button/Button";
import type { INotificationItemProps } from "../../model/types";
import { NotificationSvg } from "./svg/NotificationSvg";
import { useNavigate } from "react-router-dom";

export const NotificationItem: React.FC<
  INotificationItemProps & { onClose?: () => void }
> = ({ notification, onClose }) => {
  // Используем отформатированную дату из стейта
  const formattedDate = notification.formattedDate || notification.date;
  const navigate = useNavigate();

  const isRouteAction =
    typeof notification.action === "string" &&
    notification.action.startsWith("/");
  const buttonLabel = isRouteAction ? "Перейти" : notification.action;

  return (
    <div className={styles.notificationCard}>
      notificationMessage
      <div className={styles.notificationContent}>
        <div className={styles.icon}>
          <NotificationSvg />
        </div>
        <div className={styles.messageContainer}>
          <div className={styles.textContainer}>
            <p className={styles.notificationMessage}>{notification.message}</p>
            <p className={styles.notificationDetails}>{notification.details}</p>
          </div>

          <div>
            <p className={styles.notificationDate}>{formattedDate}</p>
          </div>
        </div>
      </div>
      {/* Временно закомментировано */}
      {/* {!notification.isRead && notification.action && (
        <div className={styles.actionButton}>
          <Button
            variant="primary"
            onClick={() => {
              if (isRouteAction) {
                // Навигация по пути, указанному в action
                navigate(notification.action as string);
                // Закрываем панель уведомлений, если передан обработчик
                onClose?.();
              } else {
                // Обычное действие — оставляем лог для разработки
                console.log("Действие выполнено!", notification.action);
              }
            }}
            disabled={false}
          >
            {buttonLabel}
          </Button>
        </div>
      )} */}
    </div>
  );
};
