# Стандарты кода и именования

Документация по стандартам кода, именования файлов и структуры проекта SkillSwap.

## Обоснование решения

**Почему выбран именно этот набор конвенций:**

1. **Соответствие экосистеме React/TypeScript** - конвенции согласованы с официальными рекомендациями React и TypeScript сообщества
2. **Единообразие** - единые правила для всего проекта снижают когнитивную нагрузку и ускоряют разработку
3. **Автоматизация** - конвенции поддерживаются линтерами и IDE, что предотвращает ошибки

## Конвенции именования файлов

### React компоненты (.tsx)

**Правило:** PascalCase

```
Правильно:
Button.tsx
UserCard.tsx
ErrorPage.tsx

Неправильно:
button.tsx
userCard.tsx
```

**Обоснование:**

- Соответствует стандартам React
- Визуально отличает компоненты от утилит
- Согласуется с именованием компонентов в коде

### Хуки

**Правило:** camelCase с префиксом `use`

```
Правильно:
useDebounce.ts
useTheme.ts
useFilteredUsers.ts

Неправильно:
UseDebounce.ts
use-debounce.ts
```

**Обоснование:**

- Префикс `use` обязателен для React хуков (правила хуков)
- camelCase соответствует конвенциям JavaScript/TypeScript для функций

### Утилиты и вспомогательные функции

**Правило:** camelCase

```
Правильно:
helpers.ts
cookies.ts
constants.ts
utils.ts

Неправильно:
Helpers.ts
helpers-utils.ts
```

**Обоснование:**

- Соответствует стандартам JavaScript/TypeScript
- Единообразие с другими функциями

### Файлы типов

**Правило:** camelCase с суффиксом `.types.ts` (всегда множественное число)

```
Правильно:
types.ts (для общих типов модуля)
user.types.ts (для типов с префиксом)
filter.types.ts

Неправильно:
type.ts (единственное число)
Type.ts (PascalCase)
user.type.ts (единственное число)
```

**Обоснование:**

- Множественное число указывает, что файл содержит несколько типов
- Единый суффикс упрощает поиск файлов типов
- Префикс позволяет группировать типы по доменам

### SCSS модули

**Правило:** camelCase с суффиксом `.module.scss`

```
Правильно:
button.module.scss
header.module.scss
userCard.module.scss

Неправильно:
Button.module.scss
button-module.scss
```

**Обоснование:**

- Соответствует имени компонента в camelCase
- CSS Modules требуют суффикс `.module`
- camelCase согласуется с TypeScript импортами

### Глобальные стили

**Правило:** kebab-case с префиксом `_`

```
Правильно:
_variables.scss
_mixins.scss
_reset.scss
_normalize.scss

Неправильно:
variables.scss
Variables.scss
```

**Обоснование:**

- Префикс `_` указывает, что файл является партиалом SCSS (не компилируется отдельно)
- kebab-case - стандарт для CSS/SCSS файлов
- Визуально отличает от модулей

### Конфигурационные файлы

**Правило:** kebab-case

```
vite.config.ts
tsconfig.json
eslint.config.js
jest.config.cjs
```

**Обоснование:**

- Соответствует стандартам экосистемы (Vite, TypeScript, ESLint)
- Единообразие с другими конфигурационными файлами

## Примеры правильного именования

### Структура компонента

```
src/shared/ui/Button/
├── Button.tsx                    # PascalCase для компонента
├── button.module.scss            # camelCase для стилей
├── types.ts                      # types.ts для типов (без префикса, т.к. в папке компонента)
└── index.ts                      # index.ts для реэкспорта (опционально)
```

### Структура entity

```
src/entities/user/
├── model/
│   ├── slice.ts                  # camelCase для файлов логики
│   └── userSlice.test.ts         # camelCase + .test.ts
└── types.ts                      # types.ts для типов сущности
```

### Структура feature

```
src/features/filter-users/
├── model/
│   ├── useFilteredUsers.ts       # camelCase + префикс use
│   └── useFilteredUsers.test.ts
└── types.ts                      # types.ts для типов фичи
```

## Именование переменных и функций

### Переменные

**Правило:** camelCase

```typescript
// Правильно:
const userName = "John";
const isAuthenticated = true;
const userList = [];

// Неправильно:
const user_name = "John";
const UserName = "John";
```

### Функции

**Правило:** camelCase

```typescript
// Правильно:
function getUserData() {}
const handleClick = () => {};
const fetchUsers = async () => {};

// Неправильно:
function GetUserData() {}
const handle_click = () => {};
```

### Константы

**Правило:** UPPER_SNAKE_CASE для глобальных констант, camelCase для локальных

```typescript
// Правильно:
const API_BASE_URL = "https://api.example.com";
const MAX_RETRIES = 3;
const defaultPageSize = 10; // локальная константа

// Неправильно:
const apiBaseUrl = "https://api.example.com"; // для глобальных
const max-retries = 3;
```

**Обоснование:**

- UPPER_SNAKE_CASE визуально выделяет важные константы
- Упрощает поиск констант в коде

### Типы и интерфейсы

**Правило:** PascalCase, можно с префиксом `T` или `I`

```typescript
// Правильно:
interface User {}
type TUser = {};
interface IUserProps {}
type CardProps = {};

// Неправильно:
interface user {}
type tUser = {};
```

**Обоснование:**

- PascalCase соответствует стандартам TypeScript
- Префиксы опциональны, но помогают отличать типы от значений

## Структура импортов

### Порядок импортов

```typescript
// 1. React и библиотеки
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. Внешние зависимости
import clsx from "clsx";

// 3. Внутренние модули (shared, widgets, pages)
import { Button } from "@shared/ui/Button/Button";
import { Card } from "@shared/ui/Card/Card";

// 4. Типы (с ключевым словом type)
import type { TUser } from "@entities/user/types";

// 5. Стили
import styles from "./component.module.scss";
```

**Обоснование:**

- Логическая группировка упрощает чтение
- Отделение типов от значений улучшает производительность сборки
- Стили в конце - стандартная практика

## Алиасы путей

**Правило:** Использовать алиасы вместо относительных путей

```typescript
// Правильно:
import { Button } from "@shared/ui/Button/Button";
import { selectAuth } from "@entities/user/model/slice";

// Неправильно:
import { Button } from "../../../shared/ui/Button/Button";
import { selectAuth } from "../../entities/user/model/slice";
```

**Обоснование:**

- Абсолютные пути устойчивы к рефакторингу
- Упрощают чтение и понимание структуры проекта
- Легче перемещать файлы без изменения импортов

## Комментарии

### Компоненты

```typescript
/**
 * Компонент карточки пользователя.
 * Отображает основную информацию о пользователе и его навыках.
 *
 * @param user - данные пользователя
 * @param cities - список городов для отображения
 * @param onDetailsClick - callback при клике на "Подробнее"
 */
export const Card: React.FC<CardProps> = ({ user, cities, onDetailsClick }) => {
  // ...
};
```

### Сложная логика

```typescript
// Почему делаем так: нужно предотвратить лишние запросы к API
// при быстрой смене фильтров. Debounce позволяет сгруппировать
// несколько изменений в один запрос.
const debouncedFilter = useDebounce(filterValue, 500);
```

**Обоснование:**

- Комментарии объясняют "почему", а не "что"
- JSDoc помогает IDE предоставлять подсказки
- Объясняют неочевидные решения

## Форматирование кода

Проект использует автоматическое форматирование через:

- **Prettier** - для форматирования кода
- **ESLint** - для проверки качества кода

**Обоснование:**

- Единообразие кода автоматически
- Меньше споров о стиле в code review
- Фокус на логике, а не форматировании

## См. также

- [Архитектура проекта](./architecture.md)
- [Руководство по FSD](./architecture.md#feature-sliced-design)
