# CSS Переменные

Документация по CSS переменным проекта.

## Основные переменные

Определены в `_variables.scss`:

```scss
:root {
  --color-primary: #4caf50;
  --color-secondary: #2196f3;
  --spacing-unit: 8px;
  // ...
}
```

## Использование

```scss
.my-component {
  color: var(--color-primary);
  padding: calc(var(--spacing-unit) * 2);
}
```

## Автоматический импорт

Переменные доступны во всех SCSS файлах через настройку Vite.
