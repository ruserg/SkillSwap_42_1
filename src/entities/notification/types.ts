// Уведомления
export interface INotification {
  id: string; // ID уведомления
  message: string; // Сообщение уведомления
  details: string; // Детали уведомления
  type: "success" | "error" | "warning"; // Тип уведомления
  date: string; // Дата создания (ISO string)
  formattedDate?: string; // Отформатированная дата (сегодня, вчера, dd.mm.YYYY)
  action?: string; // Опциональное действие
  isRead?: boolean; // Прочитано ли уведомление
  to: number; // ID пользователя, которому адресовано уведомление
  from?: number; // ID пользователя, от которого уведомление (опционально)
}
