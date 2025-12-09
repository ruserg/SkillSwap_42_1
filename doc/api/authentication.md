# Авторизация

Документация по работе с авторизацией в проекте SkillSwap.

## Обзор

Авторизация в проекте реализована через JWT токены:

- **accessToken** - короткоживущий токен (хранится в cookies)
- **refreshToken** - долгоживущий токен (хранится в localStorage)

## Хранение токенов

### AccessToken (Cookies)

Токен доступа хранится в cookies для автоматической отправки с каждым запросом:

```typescript
// Установка токена (автоматически при login/register)
setCookie("accessToken", token);

// Получение токена (автоматически в API)
const token = getCookie("accessToken");
```

**Преимущества:**

- Автоматическая отправка с запросами
- Защита от XSS (httpOnly можно добавить на сервере)
- Удобство использования

### RefreshToken (LocalStorage)

Токен обновления хранится в localStorage:

```typescript
localStorage.setItem("refreshToken", token);
const token = localStorage.getItem("refreshToken");
```

**Использование:**

- Только для обновления accessToken
- Не отправляется с каждым запросом
- Более безопасное хранение

## Регистрация

### Через Redux

```typescript
import { useAppDispatch } from "@app/store/hooks";
import { register } from "@features/auth/model/slice";

const dispatch = useAppDispatch();

// Регистрация происходит через signup feature
// Все данные собираются из signup slice и отправляются одним запросом
// См. подробнее в react-integration.md
```

**Важно:**

- Аватар обязателен при регистрации
- Все данные отправляются одним запросом с `multipart/form-data`
- Регистрация реализована через многошаговую форму (см. [Интеграция с React](./react-integration.md))

### Прямой вызов API

```typescript
import { api } from "@shared/api/api";

// Создаем FormData для отправки файла аватара
const formData = new FormData();
formData.append("email", "user@example.com");
formData.append("password", "password123");
formData.append("name", "Иван Иванов");
formData.append("avatar", avatarFile); // File объект
formData.append("firstName", "Иван");
formData.append("lastName", "Иванов");
formData.append("dateOfBirth", "1990-01-01");
formData.append("gender", "M");
formData.append("cityId", "1");

const response = await api.register(formData);

// Токены нужно сохранить вручную
setCookie("accessToken", response.accessToken);
localStorage.setItem("refreshToken", response.refreshToken);
```

## Вход

### Через Redux

```typescript
import { useAppDispatch } from "@app/store/hooks";
import { login } from "@features/auth/model/slice";

const dispatch = useAppDispatch();

try {
  const result = await dispatch(
    login({
      email: "user@example.com",
      password: "password123",
    }),
  ).unwrap();

  // Токены автоматически сохранены
  // Пользователь залогинен
  console.log("Пользователь:", result.user);
} catch (error) {
  console.error("Ошибка входа:", error);
}
```

## Получение текущего пользователя

### Через Redux

```typescript
import { useAppSelector, useAppDispatch } from "@app/store/hooks";
import { selectUser, fetchUser } from "@features/auth/model/slice";

// Получить пользователя из store
const user = useAppSelector(selectUser);

// Загрузить пользователя с сервера
const dispatch = useAppDispatch();
await dispatch(fetchUser());
```

### Прямой вызов API

```typescript
import { api } from "@/shared/api/api";

const user = await api.getMe();
```

## Проверка авторизации

### Через Redux

```typescript
import { useAppSelector } from "@app/store/hooks";
import { selectIsAuthenticated } from "@features/auth/model/slice";

const isAuthenticated = useAppSelector(selectIsAuthenticated);

if (isAuthenticated) {
  // Пользователь авторизован
}
```

### Проверка токена

```typescript
import { getCookie } from "@/shared/lib/cookies";

const token = getCookie("accessToken");
const isAuthenticated = !!token;
```

## Выход

### Через Redux

```typescript
import { useAppDispatch } from "@app/store/hooks";
import { logout } from "@features/auth/model/slice";

const dispatch = useAppDispatch();

await dispatch(logout());
// Токены автоматически очищены
// Состояние обновлено
```

### Прямой вызов API

```typescript
import { api } from "@/shared/api/api";
import { removeCookie } from "@/shared/lib/cookies";

const refreshToken = localStorage.getItem("refreshToken");
if (refreshToken) {
  await api.logout({ refreshToken });
}

// Очистить токены
removeCookie("accessToken");
localStorage.removeItem("refreshToken");
```

## Автоматическое обновление токена

Обновление токена происходит автоматически в `api.ts`:

1. При получении ошибки 403 (истекший токен)
2. API автоматически вызывает `/api/auth/refresh`
3. Если успешно - обновляет accessToken и повторяет запрос
4. Если сервер использует rotation refresh tokens, новый refreshToken также обновляется в localStorage
5. Если refreshToken истек - очищает токены и редиректит на `/login`

**Не нужно обрабатывать вручную!**

### Rotation Refresh Tokens

Если сервер использует стратегию rotation (одноразовые refresh токены), сервер может вернуть новый `refreshToken` в ответе на `/api/auth/refresh`. В этом случае новый токен автоматически сохраняется в localStorage:

```typescript
// api.ts автоматически обрабатывает это
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string; // Опционально, если сервер использует rotation
}
```

## Защищенные маршруты

Используйте `ProtectedRoute` для защиты маршрутов:

```typescript
import ProtectedRoute from '@app/ProtectedRoute';

<Route
  path="profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
```

Компонент автоматически проверяет авторизацию через Redux.

## Пример компонента авторизации

```typescript
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { login, selectIsAuthenticated } from '@features/auth/model/slice';
import { Button } from '@shared/ui/Button/Button';
import { Input } from '@shared/ui/Input/Input';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(login({ email, password })).unwrap();
      // Перенаправление после успешного входа
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  if (isAuthenticated) {
    return <div>Вы уже авторизованы</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <Button type="submit" variant="primary">
        Войти
      </Button>
    </form>
  );
};
```

## Селекторы Redux

Доступные селекторы для работы с авторизацией:

```typescript
import {
  selectAuth, // Полное состояние авторизации
  selectIsAuthenticated, // Проверка авторизации
  selectUser, // Текущий пользователь
} from "@features/auth/model/slice";

const auth = useAppSelector(selectAuth);
const isAuthenticated = useAppSelector(selectIsAuthenticated);
const user = useAppSelector(selectUser);
```

## Обработка ошибок

Ошибки авторизации обрабатываются в Redux:

```typescript
import { useAppSelector } from '@app/store/hooks';
import { selectAuth } from '@features/auth/model/slice';

const { error, isLoading } = useAppSelector(selectAuth);

if (error) {
  return <div>Ошибка: {error}</div>;
}
```

## Следующие шаги

- [Эндпоинты API](./endpoints.md) - все доступные эндпоинты
- [Redux Store](../store/auth-slice.md) - детали authSlice
- [Обработка ошибок](./errors.md) - обработка ошибок API
