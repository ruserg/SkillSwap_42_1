# Обзор API

Документация по работе с API в проекте SkillSwap.

## Базовый URL

API базовый URL настраивается через переменную окружения:

```env
VITE_API_BASE_URL=http://188.116.40.23:3001
```

## Структура API

API реализован в файле `src/shared/api/api.ts` как простой клиент на основе `fetch`.

### Основные особенности

- Автоматическая авторизация через cookies
- Автоматическое обновление токена при 403 ошибке
- Обработка ошибок с детальной информацией
- TypeScript типизация всех методов

## Импорт API

```typescript
import { api } from "@/shared/api/api";
```

## Класс ошибок

API использует кастомный класс ошибок `ApiError`:

```typescript
import { ApiError } from "@/shared/api/api";

try {
  await api.getUsers();
} catch (error) {
  if (error instanceof ApiError) {
    console.error("Статус:", error.status);
    console.error("Сообщение:", error.message);
    console.error("Данные:", error.data);
  }
}
```

## Хранение токенов

- **accessToken** - хранится в cookies (автоматически отправляется)
- **refreshToken** - хранится в localStorage

Токены управляются автоматически при:

- Входе/регистрации
- Обновлении токена
- Выходе

## Автоматическое обновление токена

При получении ошибки 403 (истекший токен):

1. API автоматически пытается обновить токен через `/api/auth/refresh`
2. Если обновление успешно - повторяет оригинальный запрос
3. Если refreshToken тоже истек - очищает токены и редиректит на `/login`

## Основные методы

### Авторизация

```typescript
// Регистрация
await api.register({ email, password, name });

// Вход
await api.login({ email, password });

// Получить текущего пользователя
await api.getMe();

// Выход
await api.logout({ refreshToken });

// Обновить токен
await api.refreshToken({ refreshToken });
```

### Пользователи

```typescript
// Получить всех пользователей
const users = await api.getUsers();

// Получить пользователя по ID
const user = await api.getUser(1);

// Обновить пользователя
const updated = await api.updateUser(1, { name: "Новое имя" });

// Удалить пользователя
await api.deleteUser(1);
```

### Навыки

```typescript
// Получить все навыки
const skills = await api.getSkills();

// С фильтрами
const skills = await api.getSkills({
  userId: 1,
  subcategoryId: 5,
  type_of_proposal: "offer",
});

// Создать навык
const skill = await api.createSkill({
  subcategoryId: 5,
  title: "Игра на гитаре",
  description: "Обучаю игре на гитаре",
  type_of_proposal: "offer",
  images: [],
});
```

### Лайки (от пользователя к пользователю)

**Важно:** Лайки ставятся от пользователя к пользователю, а не к навыкам.

```typescript
// Получить информацию о лайках для нескольких пользователей
const likesInfo = await api.getUsersLikesInfo([1, 2, 3]);
// Возвращает: [{ userId: 1, likesCount: 15, isLikedByCurrentUser: true }, ...]

// Получить информацию о лайках одного пользователя
const likesInfo = await api.getUserLikesInfo(1);
// Возвращает: { userId: 1, likesCount: 15, isLikedByCurrentUser: true }

// Создать лайк от текущего пользователя к другому пользователю
await api.createLike({ toUserId: 1 });

// Удалить лайк по пользователю (кому ставили)
await api.deleteLikeByUserId(1);
```

## Использование через Redux

Рекомендуется использовать API через Redux слайсы:

```typescript
import { useAppDispatch } from "@app/store/hooks";
import { fetchUsersData } from "@entities/user/model/slice";

const dispatch = useAppDispatch();
await dispatch(fetchUsersData());
```

Подробнее:

- [Интеграция с React и Redux](./react-integration.md) - примеры использования
- [Redux Store](../store/overview.md) - структура Redux store

## Прямое использование

Для случаев, когда Redux не нужен:

```typescript
import { api } from "@/shared/api/api";

// В компоненте или утилите
const users = await api.getUsers();
```

## Health Check

Проверка доступности API:

```typescript
const health = await api.healthCheck();
console.log(health.status, health.message);
```

## Следующие шаги

- [Интеграция с React и Redux](./react-integration.md) - примеры использования в React
- [Авторизация](./authentication.md) - детали работы с авторизацией
- [Эндпоинты](./endpoints.md) - полный список эндпоинтов
- [Обработка ошибок](./errors.md) - обработка ошибок API
