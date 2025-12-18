# Работа с формами

Документация по созданию и валидации форм.

## Компоненты

- [Input](../components/ui-components.md#input) - поле ввода
- [Selector](../components/ui-components.md#selector) - выпадающий список
- [Button](../components/ui-components.md#button) - кнопка отправки

## Валидация

### Zod схемы

Схемы валидации находятся в `src/shared/lib/zod/schemas/`:

```typescript
import { loginSchema } from "@/shared/lib/zod/schemas";

const result = loginSchema.safeParse({ email, password });
if (!result.success) {
  // Обработка ошибок
}
```

## Примеры

См. [Формы](../components/forms.md) для примеров использования.
