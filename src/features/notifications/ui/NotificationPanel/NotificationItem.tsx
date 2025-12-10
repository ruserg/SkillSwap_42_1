import React from "react";
import styles from "./notificationPanel.module.scss";
import { Button } from "@shared/ui/Button/Button";
import type { INotificationItemProps } from "../../model/types";
import { NotificationSvg } from "./svg/NotificationSvg";

export const NotificationItem: React.FC<INotificationItemProps> = ({
  notification,
}) => {
  // Используем отформатированную дату из стейта
  const formattedDate = notification.formattedDate || notification.date;

  return (
    <div className={styles.notificationCard}>
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

      {!notification.isRead && notification.action && (
        <div className={styles.actionButton}>
          <Button
            variant="primary"
            onClick={() => console.log("Действие выполнено!")}
            disabled={false}
          >
            {notification.action}
          </Button>
        </div>
      )}
    </div>
  );
};
