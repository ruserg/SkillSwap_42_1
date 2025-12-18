# Как создать новый компонент

Руководство по созданию новых компонентов в проекте SkillSwap с соблюдением стандартов и архитектуры.

## Обоснование решения

**Почему нужны четкие правила создания компонентов:**

1. **Единообразие** - все компоненты следуют одной структуре, проще ориентироваться
2. **Предсказуемость** - разработчик знает где что искать
3. **Масштабируемость** - проще добавлять новые компоненты
4. **Поддерживаемость** - единая структура упрощает рефакторинг

## Определение типа компонента

Перед созданием компонента определите его тип:

### UI Component (shared/ui/)

**Когда использовать:**

- Переиспользуемый компонент без бизнес-логики
- Используется в разных местах приложения
- Не зависит от конкретной фичи

**Примеры:** Button, Input, Card, Modal

### Widget (widgets/)

**Когда использовать:**

- Крупный композитный блок
- Содержит бизнес-логику
- Используется на нескольких страницах

**Примеры:** Filter, UserCardsSection, Header

### Feature Component (features/\*/ui/)

**Когда использовать:**

- Компонент специфичный для конкретной фичи
- Используется только в рамках одной фичи

**Примеры:** NotificationPanel, SkillForm

### Page Component (pages/)

**Когда использовать:**

- Страница приложения
- Композиция виджетов и features

**Примеры:** MainPage, Login, ProfilePage

## Создание UI компонента

### 1. Создание структуры

```bash
src/shared/ui/YourComponent/
├── YourComponent.tsx           # Компонент
├── yourComponent.module.scss   # Стили (camelCase!)
├── types.ts                    # Типы компонента
└── index.ts                    # Реэкспорт (опционально)
```

**Важно:**

- Папка компонента: **PascalCase** (YourComponent)
- Файл компонента: **PascalCase** (YourComponent.tsx)
- Файл стилей: **camelCase** (yourComponent.module.scss)
- Файл типов: **types.ts** (множественное число!)

### 2. Определение типов

**Почему наследование от React HTMLAttributes:**

```typescript
// types.ts
import type { HTMLAttributes } from "react";

// Для div
export interface YourComponentProps extends HTMLAttributes<HTMLDivElement> {
  // Только специфичные пропсы компонента
  customProp?: string;
  // Не дублируем: className, onClick, onFocus и т.д. - они уже есть
}

// Для button
import type { ButtonHTMLAttributes } from "react";

export interface YourButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  // Не дублируем: disabled, type, onClick и т.д.
}

// Для input
import type { InputHTMLAttributes } from "react";

export interface YourInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  type: "text" | "email" | "password"; // Переопределяем тип
  // Не дублируем: placeholder, value, onChange и т.д.
}
```

**Преимущества:**

- Все стандартные HTML атрибуты доступны автоматически
- Автодополнение в IDE работает лучше
- Типобезопасность
- Соответствие best practices

### 3. Реализация компонента

```typescript
// YourComponent.tsx
import type { YourComponentProps } from "./types";
import styles from "./yourComponent.module.scss";

export const YourComponent: React.FC<YourComponentProps> = ({
  customProp,
  className,
  children,
  ...restProps // Все остальные HTML атрибуты
}) => {
  return (
    <div
      {...restProps}
      className={`${styles.container} ${className || ""}`}
    >
      {children}
    </div>
  );
};
```

### 4. Стилизация

```scss
// yourComponent.module.scss
@use "@styles/variables" as *;

.container {
  // Используем CSS переменные из _variables.scss
  color: $color-text;
  background-color: $color-background;
  padding: 16px;
  border-radius: $input-border-radius;
}
```

**Важно:**

- Используйте CSS переменные, а не хардкод значений
- Используйте миксины из `_mixins.scss` где возможно
- Следуйте BEM-подобному именованию классов

### 5. Реэкспорт (опционально)

```typescript
// index.ts
export { YourComponent } from "./YourComponent";
export type { YourComponentProps } from "./types";
```

**Почему опционально:**

- Для простых компонентов можно импортировать напрямую
- Реэкспорт добавляет уровень абстракции, но усложняет навигацию

## Создание Widget компонента

### Структура

```
src/widgets/YourWidget/
├── YourWidget.tsx
├── yourWidget.module.scss
└── types.ts (если нужны специфичные типы)
```

### Особенности

- Widget может использовать Redux hooks
- Widget может импортировать features и entities
- Widget может содержать бизнес-логику

### Пример

```typescript
// YourWidget.tsx
import { useAppSelector } from "@app/store/hooks";
import { selectUsers } from "@entities/user/model/slice";
import { Card } from "@shared/ui/Card/Card";
import styles from "./yourWidget.module.scss";

export const YourWidget: React.FC = () => {
  const users = useAppSelector(selectUsers);

  return (
    <div className={styles.container}>
      {users.map(user => (
        <Card key={user.id} user={user} />
      ))}
    </div>
  );
};
```

## Создание Feature компонента

### Структура

```
src/features/your-feature/
├── model/
│   ├── slice.ts              # Redux slice (если нужен)
│   └── useYourFeature.ts     # Custom hooks
└── ui/
    ├── YourFeatureComponent.tsx
    └── yourFeatureComponent.module.scss
```

**Важно:**

- Feature содержит бизнес-логику в `model/`
- UI компоненты в `ui/`
- Feature может импортировать из `entities` и `shared`

## Создание Page компонента

### Структура

```
src/pages/YourPage/
├── YourPage.tsx
└── yourPage.module.scss
```

### Особенности

- Page только композиция виджетов и features
- Бизнес-логика в features
- Минимальное локальное состояние (только UI состояние)

### Пример

```typescript
// YourPage.tsx
import { Filter } from "@widgets/Filter/Filter";
import { UserCardsSection } from "@widgets/UserCardsSection/UserCardsSection";
import styles from "./yourPage.module.scss";

export const YourPage: React.FC = () => {
  const [filters, setFilters] = useState({});

  return (
    <div className={styles.container}>
      <Filter onFiltersChange={setFilters} />
      <UserCardsSection filters={filters} />
    </div>
  );
};
```

## Чек-лист создания компонента

- [ ] Определен тип компонента (UI/Widget/Feature/Page)
- [ ] Создана правильная структура файлов
- [ ] Типы наследуются от React HTMLAttributes где применимо
- [ ] Используется camelCase для файлов стилей
- [ ] Используются CSS переменные вместо хардкода
- [ ] Компонент типизирован (нет any)
- [ ] Импорты упорядочены правильно
- [ ] Используются алиасы путей (@shared/, @widgets/ и т.д.)
- [ ] Добавлена документация (комментарии, JSDoc)
- [ ] Компонент покрыт тестами (если критичный)

## Пример полного компонента

```typescript
// YourComponent.tsx
import type { FC } from "react";
import type { HTMLAttributes } from "react";
import clsx from "clsx";
import type { YourComponentProps } from "./types";
import styles from "./yourComponent.module.scss";

/**
 * Компонент для отображения [описание].
 *
 * @param customProp - описание пропа
 * @param children - дочерние элементы
 */
export const YourComponent: FC<YourComponentProps> = ({
  customProp,
  children,
  className,
  ...restProps
}) => {
  return (
    <div
      {...restProps}
      className={clsx(styles.container, className)}
      data-custom-prop={customProp}
    >
      {children}
    </div>
  );
};

YourComponent.displayName = "YourComponent";
```

```typescript
// types.ts
import type { HTMLAttributes } from "react";

export interface YourComponentProps extends HTMLAttributes<HTMLDivElement> {
  customProp?: string;
}
```

```scss
// yourComponent.module.scss
@use "@styles/variables" as *;

.container {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: $color-card;
  border-radius: $input-border-radius;
}
```

## См. также

- [Стандарты кода](./code-style.md)
- [Архитектура проекта](./architecture.md)
- [UI Компоненты](../components/ui-components.md)
