# Auth Slice

Документация по слайсу авторизации.

## Обзор

`authSlice` управляет состоянием авторизации пользователя, включая токены и данные пользователя.

## Состояние

```typescript
type AuthState = {
  user: User | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
};
```

**Примечание:** `accessToken` хранится в cookies, а не в Redux state.

## Начальное состояние

```typescript
const initialState: AuthState = {
  user: null,
  refreshToken: localStorage.getItem("refreshToken"),
  isLoading: false,
  error: null,
};
```

## Thunks

### fetchUser

Загрузка текущего пользователя с сервера.

```typescript
import { fetchUser } from "@store/slices/authSlice";

const dispatch = useAppDispatch();
await dispatch(fetchUser());
```

**Действия:**

- `fetchUser.pending` - начало загрузки
- `fetchUser.fulfilled` - успешная загрузка, сохраняет пользователя
- `fetchUser.rejected` - ошибка, очищает токены

### login

Вход пользователя.

```typescript
import { login } from "@store/slices/authSlice";

const dispatch = useAppDispatch();

await dispatch(
  login({
    email: "user@example.com",
    password: "password123",
  }),
);
```

**Действия:**

- `login.pending` - начало входа
- `login.fulfilled` - успешный вход:
  - Сохраняет пользователя
  - Сохраняет refreshToken в state
  - Сохраняет accessToken в cookies
- `login.rejected` - ошибка входа

### register

Регистрация нового пользователя.

```typescript
import { register } from "@store/slices/authSlice";

const dispatch = useAppDispatch();

await dispatch(
  register({
    email: "user@example.com",
    password: "password123",
    name: "Иван Иванов",
  }),
);
```

**Действия:**

- `register.pending` - начало регистрации
- `register.fulfilled` - успешная регистрация:
  - Сохраняет пользователя
  - Сохраняет refreshToken в state
  - Сохраняет accessToken в cookies
- `register.rejected` - ошибка регистрации

### logout

Выход пользователя.

```typescript
import { logout } from "@store/slices/authSlice";

const dispatch = useAppDispatch();
await dispatch(logout());
```

**Действия:**

- `logout.pending` - начало выхода
- `logout.fulfilled` - успешный выход:
  - Очищает пользователя
  - Очищает refreshToken из state
  - Очищает accessToken из cookies
- `logout.rejected` - ошибка (токены все равно очищаются)

## Reducers

### clearError

Очистка ошибки.

```typescript
import { clearError } from "@store/slices/authSlice";

const dispatch = useAppDispatch();
dispatch(clearError());
```

## Селекторы

### selectAuth

Полное состояние авторизации.

```typescript
import { selectAuth } from "@store/slices/authSlice";

const auth = useAppSelector(selectAuth);
// { user, refreshToken, isLoading, error }
```

### selectIsAuthenticated

Проверка авторизации.

```typescript
import { selectIsAuthenticated } from "@features/auth/model/slice";

const isAuthenticated = useAppSelector(selectIsAuthenticated);
// true | false
```

**Логика:**

- Проверяет наличие accessToken в cookies и пользователя в state
- Если есть токен и идет загрузка пользователя (`isLoading === true`), возвращает `true` для предотвращения редиректов во время загрузки
- Иначе возвращает `hasToken && hasUser`

### selectUser

Текущий пользователь.

```typescript
import { selectUser } from "@store/slices/authSlice";

const user = useAppSelector(selectUser);
// User | null
```

## Примеры использования

### Компонент входа

```typescript
import { useAppDispatch } from '@store/hooks';
import { login } from '@store/slices/authSlice';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(login({ email, password })).unwrap();
      // Перенаправление после успешного входа
      navigate('/');
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Поля формы */}
    </form>
  );
};
```

### Проверка авторизации

```typescript
import { useAppSelector } from '@store/hooks';
import { selectIsAuthenticated, selectUser } from '@store/slices/authSlice';

export const Profile = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  if (!isAuthenticated) {
    return <div>Необходима авторизация</div>;
  }

  return <div>Привет, {user?.name}!</div>;
};
```

### Загрузка пользователя при монтировании

Проверка авторизации централизована в `App.tsx`:

```typescript
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { fetchUser, selectAuth } from "@features/auth/model/slice";
import { getCookie } from "@shared/lib/cookies";

export const App = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(selectAuth);
  const hasToken = !!getCookie("accessToken");

  useEffect(() => {
    if (hasToken && !user && !isLoading) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, hasToken, isLoading]);

  // Если есть токен, но пользователь еще не загружен, ждем
  // Это предотвращает редиректы во время загрузки пользователя
  if (hasToken && !user) {
    return null; // или можно показать лоадер
  }

  // ...
};
```

**Важно:** Централизованная проверка в `App.tsx` предотвращает редиректы на страницу логина во время загрузки пользователя при наличии токена.

### Обработка ошибок

```typescript
import { useAppSelector } from '@store/hooks';
import { selectAuth } from '@store/slices/authSlice';

export const LoginForm = () => {
  const { error, isLoading } = useAppSelector(selectAuth);

  return (
    <form>
      {error && <div className="error">{error}</div>}
      <button disabled={isLoading}>
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
};
```

## Хранение токенов

### AccessToken

Хранится в cookies через утилиты:

- `setCookie('accessToken', token)` - при login/register
- `getCookie('accessToken')` - автоматически в API
- `removeCookie('accessToken')` - при logout/ошибке

### RefreshToken

Хранится в:

- **localStorage** - для долгосрочного хранения
- **Redux state** - для быстрого доступа

## Автоматическая очистка

При ошибке `fetchUser.rejected`:

- Очищается пользователь
- Очищается refreshToken из state
- Очищается accessToken из cookies
- Очищается refreshToken из localStorage

## Следующие шаги

- [Обзор Store](./overview.md) - общая информация
- [Авторизация API](../api/authentication.md) - работа с API
- [Защищенные маршруты](../guides/routing.md) - использование в роутинге
