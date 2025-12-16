import React from "react";
import styles from "./notificationPanel.module.scss";
import { NotificationItem } from "./NotificationItem";
import type { IReadProps } from "@features/notifications/model/types";
import { useAppDispatch } from "@app/store/hooks";
import { deleteNotification } from "@entities/notification/model/slice";

const NotificationPanel: React.FC<IReadProps> = ({
  notifications,
  onMarkAllRead,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const handleMarkAllRead = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onMarkAllRead?.(); // Вызывает колбек из шапки, чтобы убрать красную точку
  };

  const handleClearViewed = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    notifications
      .filter((n) => n.isRead)
      .forEach((n) => {
        dispatch(deleteNotification(n.id));
      });
  };

  const newSlice = notifications.filter((n) => !n.isRead);
  const viewedSlice = notifications.filter((n) => n.isRead);

  return (
    <div className={styles.panelContainer}>
      {/*новые */}
      <div className={styles.titleContainer}>
        <h3 className={styles.title}>Новые уведомления</h3>
        <a
          href="#0"
          className={styles.readEverything}
          onClick={handleMarkAllRead}
        >
          Прочитать все
        </a>
      </div>

      <div>
        {newSlice.length === 0 ? (
          <p className={styles.noNotifications}>Нет новых уведомлений</p>
        ) : (
          newSlice.map((n) => (
            <NotificationItem key={n.id} notification={n} onClose={onClose} />
          ))
        )}
      </div>

      {/*просмотренные */}
      <div className={styles.viewedCard}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>Просмотренные</h3>

          <a
            href="#0"
            className={styles.readEverything}
            onClick={handleClearViewed}
          >
            Очистить
          </a>
        </div>

        <div>
          {viewedSlice.length === 0 ? (
            <p className={styles.noNotifications}>
              Нет просмотренных уведомлений
            </p>
          ) : (
            viewedSlice.map((n) => (
              <NotificationItem key={n.id} notification={n} onClose={onClose} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
