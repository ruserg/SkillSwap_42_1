# Эндпоинты API

Полный список доступных эндпоинтов API.

## Авторизация

### POST `/api/auth/register`

Регистрация нового пользователя.

**Важно:**

- Аватар обязателен при регистрации
- Все данные отправляются через `multipart/form-data`

**Запрос:**

```typescript
// Создаем FormData для отправки файла аватара
const formData = new FormData();
formData.append("email", "user@example.com");
formData.append("password", "password123");
formData.append("name", "Иван Иванов");
formData.append("avatar", avatarFile); // File объект (обязательно)
formData.append("dateOfBirth", "1990-01-01"); // опционально, ISO format
formData.append("gender", "M"); // опционально, "M" | "F"
formData.append("cityId", "1"); // опционально

await api.register(formData);
```

**Ответ:**

```typescript
{
  user: {
    id: number,
    email: string,
    name: string,
    avatarUrl: string, // URL загруженного аватара
    dateOfRegistration: string,
    lastLoginDatetime: string
  },
  accessToken: string,
  refreshToken: string
}
```

### POST `/api/auth/login`

Вход пользователя.

**Запрос:**

```typescript
await api.login({
  email: "user@example.com",
  password: "password123",
});
```

**Ответ:**

```typescript
{
  user: User,
  accessToken: string,
  refreshToken: string
}
```

### GET `/api/auth/me`

Получить текущего пользователя.

**Запрос:**

```typescript
await api.getMe();
```

**Ответ:**

```typescript
User;
```

**Требует авторизации:** Да

### POST `/api/auth/refresh`

Обновить accessToken.

**Запрос:**

```typescript
await api.refreshToken({
  refreshToken: string,
});
```

**Ответ:**

```typescript
{
  accessToken: string;
}
```

### POST `/api/auth/logout`

Выход пользователя.

**Запрос:**

```typescript
await api.logout({
  refreshToken: string,
});
```

**Ответ:**

```typescript
{
  message: string;
}
```

**Требует авторизации:** Да

## Пользователи

### GET `/api/users`

Получить всех пользователей.

**Запрос:**

```typescript
await api.getUsers();
```

**Ответ:**

```typescript
TUser[]
```

### GET `/api/users/:id`

Получить пользователя по ID.

**Запрос:**

```typescript
await api.getUser(1);
```

**Ответ:**

```typescript
TUser;
```

### PUT `/api/users/:id`

Обновить пользователя.

**Запрос:**

```typescript
await api.updateUser(1, {
  name: "Новое имя",
  email: "new@example.com",
});
```

**Ответ:**

```typescript
TUser;
```

**Требует авторизации:** Да

### DELETE `/api/users/:id`

Удалить пользователя.

**Запрос:**

```typescript
await api.deleteUser(1);
```

**Требует авторизации:** Да

## Навыки

### GET `/api/skills`

Получить все навыки.

**Запрос:**

```typescript
// Без фильтров
await api.getSkills();

// С фильтрами
await api.getSkills({
  userId: 1,
  subcategoryId: 5,
  type_of_proposal: "offer",
});
```

**Параметры запроса:**

- `userId?: number` - фильтр по пользователю
- `subcategoryId?: number` - фильтр по подкатегории
- `type_of_proposal?: string` - фильтр по типу ('offer' | 'request')

**Ответ:**

```typescript
TSkill[]
```

### GET `/api/skills/:id`

Получить навык по ID.

**Запрос:**

```typescript
await api.getSkill(1);
```

**Ответ:**

```typescript
TSkill;
```

### POST `/api/skills`

Создать новый навык.

**Запрос:**

```typescript
await api.createSkill({
  subcategoryId: 5,
  title: "Игра на гитаре",
  description: "Обучаю игре на гитаре",
  type_of_proposal: "offer",
  images: ["url1", "url2"],
});
```

**Ответ:**

```typescript
TSkill;
```

**Требует авторизации:** Да

### PUT `/api/skills/:id`

Обновить навык.

**Запрос:**

```typescript
await api.updateSkill(1, {
  title: "Новое название",
  description: "Новое описание",
  type_of_proposal: "request",
});
```

**Ответ:**

```typescript
TSkill;
```

**Требует авторизации:** Да

### DELETE `/api/skills/:id`

Удалить навык.

**Запрос:**

```typescript
await api.deleteSkill(1);
```

**Требует авторизации:** Да

## Категории

### GET `/api/categories`

Получить все категории.

**Запрос:**

```typescript
await api.getCategories();
```

**Ответ:**

```typescript
TCategory[]
```

### GET `/api/categories/:id`

Получить категорию по ID.

**Запрос:**

```typescript
await api.getCategory(1);
```

**Ответ:**

```typescript
TCategory;
```

## Подкатегории

### GET `/api/subcategories`

Получить все подкатегории.

**Запрос:**

```typescript
// Без фильтров
await api.getSubcategories();

// С фильтром по категории
await api.getSubcategories({ categoryId: 1 });
```

**Параметры запроса:**

- `categoryId?: number` - фильтр по категории

**Ответ:**

```typescript
TSubcategory[]
```

### GET `/api/subcategories/:id`

Получить подкатегорию по ID.

**Запрос:**

```typescript
await api.getSubcategory(1);
```

**Ответ:**

```typescript
TSubcategory;
```

## Города

### GET `/api/cities`

Получить все города.

**Запрос:**

```typescript
await api.getCities();
```

**Ответ:**

```typescript
TCity[]
```

### GET `/api/cities/:id`

Получить город по ID.

**Запрос:**

```typescript
await api.getCity(1);
```

**Ответ:**

```typescript
TCity;
```

## Лайки (от пользователя к пользователю)

**Важно:** Лайки ставятся от пользователя к пользователю, а не к навыкам.

### POST `/api/likes/users-info`

Получить информацию о лайках для нескольких пользователей.

**Запрос:**

```typescript
await api.getUsersLikesInfo([1, 2, 3]);
```

**Ответ:**

```typescript
[
  {
    userId: 1,
    likesCount: 15,
    isLikedByCurrentUser: true, // или false, если не авторизован
  },
  {
    userId: 2,
    likesCount: 8,
    isLikedByCurrentUser: false,
  },
];
```

**Доступен без авторизации:** Да (но `isLikedByCurrentUser` будет `false` для неавторизованных)

### GET `/api/likes/users-info/:userId`

Получить информацию о лайках одного пользователя.

**Запрос:**

```typescript
await api.getUserLikesInfo(1);
```

**Ответ:**

```typescript
{
  userId: 1,
  likesCount: 15,
  isLikedByCurrentUser: true // или false, если не авторизован
}
```

**Доступен без авторизации:** Да (но `isLikedByCurrentUser` будет `false` для неавторизованных)

### POST `/api/likes`

Создать лайк от текущего пользователя к другому пользователю.

**Запрос:**

```typescript
await api.createLike({ toUserId: 1 });
```

**Ответ:**

```typescript
void (204 No Content)
```

**Требует авторизации:** Да

**Валидация:**

- Нельзя поставить лайк самому себе
- Если лайк уже существует, возвращается 409 Conflict

### DELETE `/api/likes/:id`

Удалить лайк по ID.

**Запрос:**

```typescript
await api.deleteLike(1);
```

**Требует авторизации:** Да

**Проверка прав:** Можно удалять только свои лайки

### DELETE `/api/likes?toUserId=:userId`

Удалить лайк по пользователю (кому ставили).

**Запрос:**

```typescript
await api.deleteLikeByUserId(1);
```

**Требует авторизации:** Да

**Проверка прав:** Можно удалять только свои лайки

## Health Check

### GET `/api/health`

Проверка доступности API.

**Запрос:**

```typescript
await api.healthCheck();
```

**Ответ:**

```typescript
{
  status: string,
  message: string
}
```

## Коды статусов

- `200` - Успешный запрос
- `201` - Ресурс создан
- `400` - Неверный запрос
- `401` - Не авторизован
- `403` - Доступ запрещен (истекший токен)
- `404` - Ресурс не найден
- `500` - Ошибка сервера

## Обработка ошибок

Все ошибки выбрасываются как `ApiError`:

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

Подробнее: [Обработка ошибок](./errors.md)
