import React from "react";
import styles from "./notificationPanel.module.scss";
import { NotificationItem } from "./NotificationItem";
import type { IReadProps } from "../../model/types";
import { useAppDispatch } from "@app/store/hooks";
import { deleteNotification } from "@entities/notification/model/slice";

const NotificationPanel: React.FC<IReadProps> = ({
  notifications,
  onMarkAllRead,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  // Обработчик, который помечает все уведомления как прочитанные
  const handleMarkAllRead = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onMarkAllRead?.(); // Вызывает колбек из шапки, чтобы убрать красную точку
  };

  // Обработчик очистки просмотренных уведомлений
  const handleClearViewed = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Удаляем все прочитанные уведомления
    notifications
      .filter((n) => n.isRead)
      .forEach((n) => {
        dispatch(deleteNotification(n.id));
      });
  };

  // Показываем все новые и все просмотренные уведомления
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
