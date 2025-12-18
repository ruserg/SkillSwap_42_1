# Notifications Slice

Документация по работе с уведомлениями в Redux store.

## Расположение

`src/entities/notification/model/slice.ts`

## Состояние

```typescript
{
  notifications: INotification[];  // Все уведомления
  toast: INotification | null;     // Текущее тост-уведомление
  isLoading: boolean;               // Состояние загрузки
  error: string | null;            // Ошибка
}
```

## Типы

### INotification

```typescript
interface INotification {
  id: string;
  message: string;
  details?: string;
  date: string; // ISO строка даты
  formattedDate?: string; // Отформатированная дата с сервера
  isRead: boolean;
  action?: string; // Текст кнопки действия
  from?: number; // ID отправителя
  to?: number; // ID получателя
}
```

**Важно:** Поле `formattedDate` заполняется на сервере и может содержать:

- `"сегодня"` - для уведомлений, созданных сегодня
- `"вчера"` - для уведомлений, созданных вчера
- `"dd.mm.YYYY"` - для более старых уведомлений (например, `"08.12.2025"`)

## Thunks

### fetchNotifications

Загружает все уведомления текущего пользователя.

```typescript
import { useAppDispatch } from "@app/store/hooks";
import { fetchNotifications } from "@entities/notification/model/slice";

const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(fetchNotifications());
}, [dispatch]);
```

### fetchUnreadNotifications

Загружает только непрочитанные уведомления.

```typescript
import { fetchUnreadNotifications } from "@entities/notification/model/slice";

dispatch(fetchUnreadNotifications());
```

### fetchToastNotification

Загружает текущее тост-уведомление (самое свежее непрочитанное).

```typescript
import { fetchToastNotification } from "@entities/notification/model/slice";

dispatch(fetchToastNotification());
```

**Примечание:** Тост не добавляется в список `notifications`, он хранится отдельно в `toast`.

### fetchNotificationById

Загружает уведомление по ID.

```typescript
import { fetchNotificationById } from "@entities/notification/model/slice";

dispatch(fetchNotificationById(notificationId));
```

### markNotificationAsRead

Отмечает уведомление как прочитанное.

```typescript
import { markNotificationAsRead } from "@entities/notification/model/slice";

await dispatch(markNotificationAsRead(notificationId));
```

### markAllNotificationsAsRead

Отмечает все уведомления как прочитанные.

```typescript
import { markAllNotificationsAsRead } from "@entities/notification/model/slice";

await dispatch(markAllNotificationsAsRead());
```

### deleteNotification

Удаляет уведомление.

```typescript
import { deleteNotification } from "@entities/notification/model/slice";

await dispatch(deleteNotification(notificationId));
```

### deleteAllNotifications

Удаляет все уведомления текущего пользователя.

```typescript
import { deleteAllNotifications } from "@entities/notification/model/slice";

await dispatch(deleteAllNotifications());
```

## Селекторы

### selectNotifications

Получить все уведомления.

```typescript
import { useAppSelector } from "@app/store/hooks";
import { selectNotifications } from "@entities/notification/model/slice";

const notifications = useAppSelector(selectNotifications);
```

### selectUnreadNotifications

Получить только непрочитанные уведомления.

```typescript
import { selectUnreadNotifications } from "@entities/notification/model/slice";

const unreadNotifications = useAppSelector(selectUnreadNotifications);
```

### selectUnreadNotificationsCount

Получить количество непрочитанных уведомлений.

```typescript
import { selectUnreadNotificationsCount } from "@entities/notification/model/slice";

const count = useAppSelector(selectUnreadNotificationsCount);
```

### selectToast

Получить текущее тост-уведомление.

```typescript
import { selectToast } from "@entities/notification/model/slice";

const toast = useAppSelector(selectToast);
```

### selectNotificationById

Получить уведомление по ID.

```typescript
import { selectNotificationById } from "@entities/notification/model/slice";

const notification = useAppSelector(selectNotificationById(notificationId));
```

## Actions

### clearToast

Очистить текущее тост-уведомление.

```typescript
import { clearToast } from "@entities/notification/model/slice";

dispatch(clearToast());
```

### clearError

Очистить ошибку.

```typescript
import { clearError } from "@entities/notification/model/slice";

dispatch(clearError());
```

### markAsReadOptimistic

Оптимистичное обновление статуса прочитанности (без запроса к серверу).

```typescript
import { markAsReadOptimistic } from "@entities/notification/model/slice";

dispatch(markAsReadOptimistic(notificationId));
```

## Примеры использования

### Загрузка уведомлений при монтировании

```typescript
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import {
  fetchNotifications,
  selectNotifications,
  selectUnreadNotificationsCount,
} from "@entities/notification/model/slice";

export const NotificationBell = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadNotificationsCount);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div>
      <span>Уведомления ({unreadCount})</span>
    </div>
  );
};
```

### Периодическая загрузка уведомлений

```typescript
import { useEffect } from "react";
import { useAppDispatch } from "@app/store/hooks";
import { fetchNotifications } from "@entities/notification/model/slice";

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Первая загрузка
    dispatch(fetchNotifications());

    // Периодическая проверка каждые 30 секунд
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return <div>...</div>;
};
```

### Отметить все как прочитанные

```typescript
import { useAppDispatch } from "@app/store/hooks";
import { markAllNotificationsAsRead } from "@entities/notification/model/slice";

const handleMarkAllRead = async () => {
  await dispatch(markAllNotificationsAsRead());
};
```

## Интеграция с компонентами

### NotificationPanel

Компонент панели уведомлений использует этот slice:

```typescript
import { useAppSelector, useAppDispatch } from "@app/store/hooks";
import {
  selectNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "@entities/notification/model/slice";

const notifications = useAppSelector(selectNotifications);
const dispatch = useAppDispatch();

const handleMarkAsRead = (id: string) => {
  dispatch(markNotificationAsRead(id));
};
```

### Toast

Компонент тост-уведомлений использует `selectToast`:

```typescript
import { useAppSelector, useAppDispatch } from "@app/store/hooks";
import { selectToast, clearToast } from "@entities/notification/model/slice";

const toast = useAppSelector(selectToast);
const dispatch = useAppDispatch();

const handleClose = () => {
  dispatch(clearToast());
};
```

## Важные замечания

1. **Форматирование дат:** Все уведомления приходят с сервера с уже отформатированными датами в поле `formattedDate`. Клиентская часть не выполняет форматирование.

2. **Тост-уведомления:** Тост хранится отдельно от списка уведомлений в поле `toast`. При загрузке через `fetchToastNotification` тост не добавляется в `notifications`.

3. **Автоматическое обновление:** Рекомендуется настроить периодическую загрузку уведомлений (например, каждые 30 секунд) для актуальности данных.

4. **Оптимистичные обновления:** Используйте `markAsReadOptimistic` для мгновенного обновления UI без ожидания ответа сервера.

## Связанные компоненты

- [NotificationPanel](../../features/notifications/ui/NotificationPanel/NotificationPanel.tsx) - панель уведомлений
- [Toast](../../widgets/Toast/Toast.tsx) - компонент тост-уведомлений
- [Header](../../widgets/Header/Header.tsx) - использует счетчик непрочитанных
