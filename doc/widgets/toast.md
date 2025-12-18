# Toast

Документация по компоненту тост-уведомлений.

## Расположение

`src/widgets/Toast/Toast.tsx`

## Описание

Компонент для отображения тост-уведомлений - временных всплывающих сообщений, которые автоматически скрываются через 5 секунд.

## Использование

Компонент автоматически отображается в Layout, если есть активное тост-уведомление:

```typescript
// src/widgets/Layout/Layout.tsx
import { Toast } from "@widgets/Toast/Toast";

export const Layout = () => {
  return (
    <div>
      <Header />
      <main>...</main>
      <Footer />
      <Toast />
    </div>
  );
};
```

## Функциональность

- Автоматическое отображение при наличии тост-уведомления
- Автоматическое скрытие через 5 секунд
- Кнопка закрытия
- Кнопка действия (если указана в уведомлении и оно не прочитано)
- Интеграция с Redux для получения и управления тостом

## Позиционирование

Тост позиционируется:

- Внизу экрана по центру
- В пределах контентной области (max-width: 1440px)
- С отступом 24px от низа
- Горизонтально центрирован

## Стилизация

Стили находятся в `src/widgets/Toast/toast.module.scss`.

### Темы

Компонент поддерживает светлую и темную темы:

- Светлая тема: фон `#DEEBC5`
- Темная тема: фон `#4d5a3d`

## Redux интеграция

### Селекторы

```typescript
import { selectToast } from "@entities/notification/model/slice";

const toast = useAppSelector(selectToast);
```

### Actions

```typescript
import {
  clearToast,
  markNotificationAsRead,
} from "@entities/notification/model/slice";

// Закрыть тост
dispatch(clearToast());

// Отметить как прочитанное (закрывает тост)
dispatch(markNotificationAsRead(toast.id));
```

## Структура уведомления

Тост использует объект `INotification`:

```typescript
interface INotification {
  id: string;
  message: string; // Основное сообщение
  details?: string; // Дополнительные детали
  formattedDate?: string; // Отформатированная дата (не отображается в тосте)
  isRead: boolean;
  action?: string; // Текст кнопки действия
}
```

## Поведение

1. **Автоматическое отображение:** Тост появляется автоматически, когда в Redux store появляется новое тост-уведомление (через `fetchToastNotification`).

2. **Автоматическое скрытие:** Тост автоматически скрывается через 5 секунд после появления.

3. **Кнопка действия:** Отображается только если:
   - У уведомления есть поле `action`
   - Уведомление не прочитано (`isRead === false`)

4. **Закрытие:** При клике на кнопку закрытия или действии тост удаляется из store через `clearToast()` или `markNotificationAsRead()`.

## Примеры

### Получение тоста с сервера

```typescript
import { useEffect } from "react";
import { useAppDispatch } from "@app/store/hooks";
import { fetchToastNotification } from "@entities/notification/model/slice";

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Загружаем тост при монтировании
    dispatch(fetchToastNotification());

    // Периодическая проверка каждую минуту
    const interval = setInterval(() => {
      dispatch(fetchToastNotification());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return <div>...</div>;
};
```

### Ручное управление тостом

```typescript
import { useAppSelector, useAppDispatch } from "@app/store/hooks";
import { selectToast, clearToast } from "@entities/notification/model/slice";

const toast = useAppSelector(selectToast);
const dispatch = useAppDispatch();

const handleClose = () => {
  dispatch(clearToast());
};
```

## Анимация

Тост появляется с анимацией `slideUp` (снизу вверх).

## Важные замечания

1. **Дата не отображается:** В тосте не показывается дата, так как тосты - это "прямо сейчас" уведомления.

2. **Не добавляется в список:** Тост не добавляется в общий список уведомлений (`notifications`), он хранится отдельно в `state.toast`.

3. **Автоматическая загрузка:** Рекомендуется настроить периодическую загрузку тостов (например, каждую минуту) для получения новых уведомлений.

## Связанные компоненты

- [Notifications Slice](../store/notifications-slice.md) - Redux slice для уведомлений
- [NotificationPanel](../features/notifications/ui/NotificationPanel/NotificationPanel.tsx) - панель всех уведомлений
- [Header](./header-footer.md) - использует счетчик уведомлений
