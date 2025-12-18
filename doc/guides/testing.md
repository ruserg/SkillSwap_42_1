# Тестирование

Документация по написанию тестов.

## Настройка

Jest настроен в `jest.config.cjs`:

- Окружение: jsdom
- Моки для статических файлов
- Поддержка TypeScript

## Примеры тестов

### Тест компонента

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@shared/ui/Button';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Тест хука

```typescript
import { renderHook } from "@testing-library/react";
import { useFilteredUsers } from "@shared/hooks/useFilteredUsers";

test("filters users correctly", () => {
  const { result } = renderHook(() =>
    useFilteredUsers({
      filters: { gender: "M" },
      usersWithLikes: users,
      skills: skills,
    }),
  );

  expect(result.current.filteredUsers).toHaveLength(5);
});
```

## Запуск тестов

```bash
npm run test          # Запуск тестов
npm run test:watch    # Watch режим
npm run test:coverage # Покрытие кода
```
