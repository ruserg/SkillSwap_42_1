# Header и Footer

Документация по шапке и подвалу сайта.

## Header

Виджет шапки сайта (`src/widgets/Header/Header.tsx`).

### Функциональность

- Логотип приложения
- Навигационное меню
- Поиск
- Профиль пользователя
- Переключение темы (если реализовано)

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

## Стилизация

Стили находятся в:

- `header.module.scss` - стили шапки
- `footer.module.scss` - стили подвала

## Следующие шаги

- [MainPage](../guides/architecture.md) - использование в страницах
- [Логотип](../components/ui-components.md#logo) - компонент логотипа
