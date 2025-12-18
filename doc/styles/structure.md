# Структура стилей

Документация по организации стилей в проекте.

## Структура файлов

```
src/styles/
├── _variables.scss    # CSS переменные
├── _mixins.scss      # SCSS миксины
├── _normalize.scss   # Нормализация стилей
├── _reset.scss       # Сброс стилей
├── _fonts.scss       # Шрифты
├── themes/
│   ├── light.scss    # Светлая тема
│   └── dark.scss    # Темная тема
└── assets/
    └── fonts/        # Файлы шрифтов
```

## Глобальные стили

### index.scss

Главный файл стилей (`src/index.scss`):

```scss
@import "./styles/normalize";
@import "./styles/reset";
@import "./styles/fonts";
@import "./styles/variables";
@import "./styles/mixins";
@import "./styles/themes/light";
```

### \_variables.scss

CSS переменные для цветов, размеров и других значений:

```scss
:root {
  --color-primary: #4caf50;
  --color-secondary: #2196f3;
  --spacing-unit: 8px;
  // ...
}
```

### \_mixins.scss

SCSS миксины для переиспользования стилей:

```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## CSS Modules

Каждый компонент имеет свой файл стилей:

```
Component/
├── Component.tsx
└── component.module.scss
```

### Использование

```typescript
import styles from './component.module.scss';

<div className={styles.container}>
  <h1 className={styles.title}>Заголовок</h1>
</div>
```

### Именование классов

Используйте BEM-подобное именование:

```scss
.container {
  &__header {
    // .container__header
  }

  &_active {
    // .container_active
  }
}
```

## Темы

### Светлая тема

`themes/light.scss` - стили для светлой темы.

### Темная тема

`themes/dark.scss` - стили для темной темы.

### Переключение темы

```typescript
// Добавить класс темы на body
document.body.classList.add("theme-dark");
```

## Импорт переменных и миксинов

В `vite.config.ts` настроен автоматический импорт:

```typescript
scss: {
  additionalData: `
    @use "@styles/variables" as *;
    @use "@styles/mixins" as *;
  `,
}
```

Это позволяет использовать переменные и миксины без импорта:

```scss
.my-component {
  color: var(--color-primary);
  @include flex-center;
}
```

## Следующие шаги

- [CSS Modules](./css-modules.md) - детали работы с CSS Modules
- [Темы](./themes.md) - работа с темами
- [Переменные](./variables.md) - доступные CSS переменные
