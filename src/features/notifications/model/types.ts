// Используем тип из entities для единообразия
import type { INotification } from "@entities/notification/types";

export type { INotification };

export interface INotificationItemProps {
  notification: INotification;
}

export interface IReadProps {
  notifications: INotification[];
  onMarkAllRead?: () => void; //вызывается при пометке всех как прочитанных
  isOpen?: boolean; //пропс, чтобы знать, открыта панель или нет
}
