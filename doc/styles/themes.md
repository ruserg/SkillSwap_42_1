# Темы

Документация по работе с темами.

## Доступные темы

- **Светлая** (`themes/light.scss`) - тема по умолчанию
- **Темная** (`themes/dark.scss`) - темная тема

## Переключение темы

```typescript
// Добавить класс на body
document.body.classList.add("theme-dark");

// Удалить класс
document.body.classList.remove("theme-dark");
```

## Использование переменных

Темы используют CSS переменные:

```scss
.theme-dark {
  --color-primary: #4caf50;
  --color-background: #121212;
}
```
