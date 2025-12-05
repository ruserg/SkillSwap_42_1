# Обработка ошибок API

Документация по обработке ошибок при работе с API.

## Класс ApiError

Все ошибки API выбрасываются как экземпляры класса `ApiError`:

```typescript
export class ApiError extends Error {
  status: number; // HTTP статус код
  data?: unknown; // Дополнительные данные ошибки
  message: string; // Сообщение об ошибке
}
```

## Базовая обработка

### Try-Catch

```typescript
import { api, ApiError } from "@/shared/api/api";

try {
  const users = await api.getUsers();
} catch (error) {
  if (error instanceof ApiError) {
    console.error("Статус:", error.status);
    console.error("Сообщение:", error.message);
    console.error("Данные:", error.data);
  } else {
    console.error("Неизвестная ошибка:", error);
  }
}
```

### Обработка в Redux

Ошибки автоматически обрабатываются в Redux слайсах:

```typescript
import { useAppSelector } from '@store/hooks';
import { selectUsersData } from '@store/slices/usersDataSlice';

const { users, isLoading, error } = useAppSelector(selectUsersData);

if (error) {
  return <div>Ошибка: {error}</div>;
}
```

## Коды статусов

### 400 - Неверный запрос

Ошибка валидации данных:

```typescript
try {
  await api.register({
    email: "invalid-email",
    password: "123",
    name: "",
  });
} catch (error) {
  if (error instanceof ApiError && error.status === 400) {
    // Ошибка валидации
    console.error("Проверьте введенные данные:", error.message);
  }
}
```

### 401 - Не авторизован

Токен отсутствует или невалиден:

```typescript
try {
  await api.getMe();
} catch (error) {
  if (error instanceof ApiError && error.status === 401) {
    // Перенаправить на страницу входа
    window.location.href = "/login";
  }
}
```

### 403 - Доступ запрещен

Токен истек (обрабатывается автоматически):

```typescript
// API автоматически пытается обновить токен
// Если не удалось - редирект на /login
// Не нужно обрабатывать вручную
```

### 404 - Ресурс не найден

Запрашиваемый ресурс не существует:

```typescript
try {
  await api.getUser(999);
} catch (error) {
  if (error instanceof ApiError && error.status === 404) {
    console.error("Пользователь не найден");
  }
}
```

### 500 - Ошибка сервера

Внутренняя ошибка сервера:

```typescript
try {
  await api.getUsers();
} catch (error) {
  if (error instanceof ApiError && error.status === 500) {
    console.error("Ошибка сервера, попробуйте позже");
  }
}
```

## Утилита для обработки ошибок

Создайте утилиту для удобной обработки:

```typescript
// src/shared/lib/errorHandler.ts
import { ApiError } from "@/shared/api/api";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return "Неверные данные. Проверьте введенную информацию.";
      case 401:
        return "Необходима авторизация.";
      case 403:
        return "Доступ запрещен.";
      case 404:
        return "Ресурс не найден.";
      case 500:
        return "Ошибка сервера. Попробуйте позже.";
      default:
        return error.message || "Произошла ошибка";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Неизвестная ошибка";
};

// Использование
try {
  await api.getUsers();
} catch (error) {
  const message = getErrorMessage(error);
  console.error(message);
}
```

## Обработка в компонентах

### Показ ошибок пользователю

```typescript
import { useState } from 'react';
import { api, ApiError } from '@/shared/api/api';
import { getErrorMessage } from '@/shared/lib/errorHandler';

export const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={loadUsers}>Попробовать снова</button>
      </div>
    );
  }

  // ...
};
```

### Обработка через Redux

```typescript
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchUsersData, selectUsersData } from '@store/slices/usersDataSlice';

export const UsersList = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector(selectUsersData);

  useEffect(() => {
    dispatch(fetchUsersData());
  }, [dispatch]);

  if (error) {
    return (
      <div className="error">
        <p>Ошибка: {error}</p>
        <button onClick={() => dispatch(fetchUsersData())}>
          Попробовать снова
        </button>
      </div>
    );
  }

  // ...
};
```

## Автоматическое обновление токена

При ошибке 403 API автоматически:

1. Пытается обновить токен через `/api/auth/refresh`
2. Если успешно - повторяет оригинальный запрос
3. Если не удалось - очищает токены и редиректит на `/login`

**Не нужно обрабатывать 403 вручную!**

## Логирование ошибок

Для продакшена рекомендуется логировать ошибки:

```typescript
import { ApiError } from "@/shared/api/api";

try {
  await api.getUsers();
} catch (error) {
  if (error instanceof ApiError) {
    // Логирование в систему мониторинга
    console.error("API Error:", {
      status: error.status,
      message: error.message,
      data: error.data,
      url: "/api/users",
    });
  }
}
```

## Следующие шаги

- [Обзор API](./overview.md) - общая информация об API
- [Авторизация](./authentication.md) - работа с авторизацией
- [Redux Store](../store/overview.md) - обработка ошибок в Redux
