# Header и Footer

Документация по шапке и подвалу сайта.

## Header

Виджет шапки сайта (`src/widgets/Header/Header.tsx`).

### Функциональность

- Логотип приложения
- Навигационное меню
- Поиск
- Профиль пользователя
- Уведомления (колокольчик с счетчиком непрочитанных)
- Избранное (иконка сердца, ссылка на `/favorites`)
- Переключение темы (реализовано)

### Навигация

Header содержит ссылку на страницу избранного через иконку сердца:

```typescript
// src/widgets/Header/Header.tsx
<Link to="/favorites" className={styles.favoritesLink}>
  <DecoratedButton variant={"heart"} />
</Link>
```

При клике на иконку сердца происходит переход на страницу `/favorites`.

### Использование

```typescript
import { Header } from '@widgets/Header/Header';

export const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        {/* Контент */}
      </main>
    </div>
  );
};
```

## Footer

Виджет подвала сайта (`src/widgets/Footer/Footer.tsx`).

### Функциональность

- Логотип и копирайт
- Ссылки на разделы:
  - О проекте
  - Контакты
  - Политика конфиденциальности
  - Все навыки
  - Блог
  - Пользовательское соглашение

### Использование

```typescript
import { Footer } from '@widgets/Footer/Footer';

export const Layout = () => {
  return (
    <div>
      <main>
        {/* Контент */}
      </main>
      <Footer />
    </div>
  );
};
```

## Уведомления

Header включает функциональность уведомлений:

- Иконка колокольчика с счетчиком непрочитанных уведомлений
- Выпадающая панель со списком всех уведомлений
- Разделение на новые и прочитанные уведомления
- Возможность отметить все как прочитанные
- Возможность удалить прочитанные уведомления

### Использование уведомлений в Header

```typescript
import { useAppSelector, useAppDispatch } from "@app/store/hooks";
import {
  selectUnreadNotificationsCount,
  fetchNotifications,
  markAllNotificationsAsRead,
} from "@entities/notification/model/slice";

const count = useAppSelector(selectUnreadNotificationsCount);
const dispatch = useAppDispatch();

// Загрузка уведомлений при открытии панели
const handleOpenNotifications = () => {
  dispatch(fetchNotifications());
};

// Отметить все как прочитанные
const handleMarkAllRead = async () => {
  await dispatch(markAllNotificationsAsRead());
};
```

## Стилизация

Стили находятся в:

- `header.module.scss` - стили шапки
- `footer.module.scss` - стили подвала

## Связанные компоненты

- [NotificationPanel](../features/notifications/ui/NotificationPanel/NotificationPanel.tsx) - панель уведомлений
- [Notifications Slice](../store/notifications-slice.md) - Redux slice для уведомлений
- [Toast](./toast.md) - тост-уведомления

## Следующие шаги

- [MainPage](../guides/architecture.md) - использование в страницах
- [Логотип](../components/ui-components.md#logo) - компонент логотипа
