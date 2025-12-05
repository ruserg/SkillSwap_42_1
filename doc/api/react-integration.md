# Интеграция API с React и Redux

Документация по использованию SkillSwap API в React приложении с Redux Toolkit.

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install @reduxjs/toolkit react-redux
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
VITE_API_BASE_URL=http://188.116.40.23:3001
```

### 3. Структура API

API реализован через простой fetch в файле `src/shared/api/api.ts`. Все методы возвращают Promise и автоматически обрабатывают авторизацию через cookies.

## Использование через Redux

Рекомендуется использовать API через Redux слайсы для управления состоянием.

### Настройка Store

```typescript
// src/app/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@features/auth/model/slice";
import { usersDataReducer } from "@entities/user/model/slice";
import { categoryReducer } from "@entities/category/model/slice";
import { cityReducer } from "@entities/city/model/slice";
import { skillsDataReducer } from "@entities/skill/model/slice";
import { likesReducer } from "@entities/like/model/slice";
import { signupReducer } from "@features/signup/model/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    usersData: usersDataReducer,
    categoryData: categoryReducer,
    cities: cityReducer,
    skillsData: skillsDataReducer,
    likes: likesReducer,
    signup: signupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Провайдер

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store/store';
import App from './app/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

## Примеры использования

### Пользователи

```typescript
// src/widgets/UserCardsSection/UserCardsSection.tsx
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { fetchUsersData, selectUsersData } from '@entities/user/model/slice';
import { useEffect } from 'react';

export const UsersList = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading } = useAppSelector(selectUsersData);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsersData());
    }
  }, [dispatch, users.length]);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} ({user.email}) - Лайков: {user.likesCount}
        </li>
      ))}
    </ul>
  );
};
```

**Важно:** Пользователи содержат информацию о лайках:

- `likesCount: number` - общее количество лайков
- `isLikedByCurrentUser: boolean` - лайкнул ли текущий пользователь

### Навыки

```typescript
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { fetchSkillsData, selectSkillsData } from "@entities/skill/model/slice";

export const SkillsList = () => {
  const dispatch = useAppDispatch();
  const { skills, isLoading } = useAppSelector(selectSkillsData);

  useEffect(() => {
    if (skills.length === 0) {
      dispatch(fetchSkillsData());
    }
  }, [dispatch, skills.length]);

  // ...
};
```

### Лайки (от пользователя к пользователю)

**Важно:** Лайки ставятся от пользователя к пользователю, а не к навыкам.

```typescript
import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import { createLike, deleteLike, selectUserLikesInfo } from '@entities/like/model/slice';

export const LikeButton = ({ userId }: { userId: number }) => {
  const dispatch = useAppDispatch();
  const likesInfo = useAppSelector(selectUserLikesInfo(userId));
  const { likesCount, isLikedByCurrentUser } = likesInfo;

  const handleToggle = async () => {
    if (isLikedByCurrentUser) {
      await dispatch(deleteLike(userId));
    } else {
      await dispatch(createLike({ toUserId: userId }));
    }
  };

  return (
    <button onClick={handleToggle}>
      {isLikedByCurrentUser ? '❤️' : '🤍'} {likesCount}
    </button>
  );
};
```

### Категории и города

```typescript
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import {
  fetchCategoryData,
  selectCategoryData,
} from "@entities/category/model/slice";
import { fetchCities, selectCities } from "@entities/city/model/slice";

export const CategoriesList = () => {
  const dispatch = useAppDispatch();
  const { categories, subcategories, isLoading } =
    useAppSelector(selectCategoryData);
  const { cities } = useAppSelector(selectCities);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoryData());
    }
    if (cities.length === 0) {
      dispatch(fetchCities());
    }
  }, [dispatch, categories.length, cities.length]);

  // ...
};
```

## Селекторы

### Авторизация

```typescript
import { useAppSelector } from "@app/store/hooks";
import {
  selectAuth,
  selectIsAuthenticated,
  selectUser,
} from "@features/auth/model/slice";

export const Profile = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const auth = useAppSelector(selectAuth);

  // ...
};
```

### Пользователи

```typescript
import { selectUsersData } from "@entities/user/model/slice";

const { users, isLoading } = useAppSelector(selectUsersData);
// users содержат likesCount и isLikedByCurrentUser
```

### Навыки

```typescript
import { selectSkillsData } from "@entities/skill/model/slice";

const { skills, isLoading } = useAppSelector(selectSkillsData);
```

### Лайки

```typescript
import {
  selectUserLikesInfo,
  selectUsersLikesInfo,
} from "@entities/like/model/slice";

// Для одного пользователя
const likesInfo = useAppSelector(selectUserLikesInfo(userId));
// { userId, likesCount, isLikedByCurrentUser }

// Для нескольких пользователей
const likesInfo = useAppSelector(selectUsersLikesInfo([1, 2, 3]));
```

### Категории и города

```typescript
import { selectCategoryData } from "@entities/category/model/slice";
import { selectCities } from "@entities/city/model/slice";

const { categories, subcategories, isLoading } =
  useAppSelector(selectCategoryData);
const { cities } = useAppSelector(selectCities);
```

## Регистрация (многошаговая форма)

Регистрация происходит в 3 шага через `signup` feature:

```typescript
// src/pages/signup/ui/SignupStepOne/SignupStepOne.tsx
// Шаг 1: Email и пароль
// Шаг 2: Личная информация (имя, дата рождения, пол, город) + аватар
// Шаг 3: Навык (название, категория, описание, фото)

// Все данные сохраняются в Redux store через signup slice
// Финальная отправка происходит в SignupStepThree через submitSignup thunk
```

**Важно:**

- Аватар обязателен при регистрации
- Все данные отправляются одним запросом с `multipart/form-data`
- Пароль должен содержать: минимум 8 символов, заглавную и строчную латинские буквы, цифру, спецсимволы разрешены

## Вход

```typescript
// src/pages/login/Login.tsx
import { useAppDispatch } from '@app/store/hooks';
import { login } from '@features/auth/model/slice';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Ошибка входа:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div>{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
};
```

## Выход

```typescript
import { useAppDispatch } from '@app/store/hooks';
import { logout } from '@features/auth/model/slice';
import { useNavigate } from 'react-router-dom';

export const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return <button onClick={handleLogout}>Выйти</button>;
};
```

## Защищенные маршруты

```typescript
// src/app/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import { selectIsAuthenticated } from "@features/auth/model/slice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

## Обработка ошибок

Ошибки автоматически сохраняются в состояние слайса:

```typescript
import { useAppSelector } from '@app/store/hooks';
import { selectUsersData } from '@entities/user/model/slice';

export const UsersList = () => {
  const { users, isLoading, error } = useAppSelector(selectUsersData);

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  // ...
};
```

## Прямое использование API

Для случаев, когда Redux не нужен:

```typescript
import { api } from "@/shared/api/api";

// Получить всех пользователей
const users = await api.getUsers();

// Получить пользователя по ID
const user = await api.getUser(1);

// Обновить пользователя
const updatedUser = await api.updateUser(1, { name: "Новое имя" });

// Удалить пользователя
await api.deleteUser(1);
```

## Важные замечания

1. **Токены**:
   - `accessToken` хранится в cookies (автоматически отправляется с запросами)
   - `refreshToken` хранится в localStorage (используется только для обновления)

2. **Автоматическое обновление**: Токен обновляется автоматически при получении ошибки 403

3. **Обработка ошибок**: Все ошибки обрабатываются в слайсах через `rejectWithValue`

4. **Лайки**: Лайки ставятся от пользователя к пользователю, не к навыкам. Информация о лайках (`likesCount`, `isLikedByCurrentUser`) возвращается вместе с данными пользователя.

5. **Регистрация**: Аватар обязателен при регистрации. Все данные отправляются одним запросом с `multipart/form-data`.

6. **Валидация пароля**: Пароль должен содержать минимум 8 символов, заглавную и строчную латинские буквы, цифру. Спецсимволы разрешены, но русские буквы запрещены.

7. **Структура проекта**: Проект использует Feature-Sliced Design (FSD) архитектуру для лучшей организации кода.

## Структура файлов (Feature-Sliced Design)

Проект использует архитектуру Feature-Sliced Design (FSD):

```
src/
├── app/                        # Инициализация приложения
│   ├── store/                  # Redux store
│   ├── Routes.tsx              # Маршруты
│   └── App.tsx                  # Корневой компонент
├── pages/                      # Страницы
│   ├── MainPage/
│   ├── login/
│   └── signup/
├── widgets/                     # Сложные UI компоненты
│   ├── Header/
│   ├── Footer/
│   └── UserCardsSection/
├── features/                   # Бизнес-логика
│   ├── auth/                   # Авторизация
│   │   └── model/
│   │       └── slice.ts
│   ├── signup/                 # Регистрация
│   │   └── model/
│   │       └── slice.ts
│   └── filter-users/           # Фильтрация пользователей
├── entities/                    # Бизнес-сущности
│   ├── user/
│   │   ├── model/slice.ts
│   │   └── types.ts
│   ├── skill/
│   ├── category/
│   ├── city/
│   └── like/
└── shared/                      # Переиспользуемый код
    ├── api/
    │   └── api.ts              # Основной API файл
    ├── lib/
    │   ├── cookies.ts          # Утилиты для работы с cookies
    │   ├── types/
    │   │   └── api.ts          # Типы API
    │   └── utils/              # Утилиты
    └── ui/                      # UI компоненты
        ├── Button/
        ├── Card/
        ├── Like/
        └── ...
```

### Правила импортов FSD

- `shared` не импортирует из `features`, `widgets`, `pages`
- `entities` не импортирует из `features`, `widgets`, `pages`
- `features` могут импортировать из `entities` и `shared`
- `widgets` могут импортировать из `features`, `entities` и `shared`
- `pages` могут импортировать из всех слоёв

## Следующие шаги

- [Обзор API](./overview.md) - общая информация об API
- [Авторизация](./authentication.md) - детали работы с авторизацией
- [Эндпоинты](./endpoints.md) - полный список эндпоинтов
- [Redux Store](../store/overview.md) - структура Redux store
