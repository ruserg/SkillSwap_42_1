# Документация для фронтенда (React + Redux Toolkit)

Документация по интеграции SkillSwap API в React приложение с использованием Redux Toolkit.

## Базовый URL

```
http://188.116.40.23:3001
```

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

## Авторизация

### Типы для авторизации

Все типы находятся в `src/shared/types/types.ts`:

```typescript
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  dateOfRegistration: string;
  lastLoginDatetime: string;
}
```

### Хранение токенов

- **accessToken** хранится в **cookies** (автоматически отправляется с запросами)
- **refreshToken** хранится в **localStorage** (используется только для обновления токена)

### Использование авторизации через Redux

Авторизация управляется через `authSlice`:

```typescript
// src/components/Login.tsx
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { login, selectIsAuthenticated } from '@store/slices/authSlice';
import { useState } from 'react';

export const Login = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      // Перенаправление на главную
      window.location.href = '/';
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
      <button type="submit">Войти</button>
    </form>
  );
};
```

### Автоматическое обновление токена

Обновление токена происходит автоматически в `api.ts` при получении ошибки 403. Если refreshToken тоже истек, пользователь перенаправляется на страницу логина.

## Эндпоинты API

### Users (Пользователи)

#### Использование через слайсы

```typescript
// src/components/UsersList.tsx
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchUsersData, selectUsersData } from '@store/slices/usersDataSlice';
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
          {user.name} ({user.email})
        </li>
      ))}
    </ul>
  );
};
```

#### Прямое использование API

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

### Skills (Навыки)

#### Использование через слайсы

```typescript
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  fetchSkillsData,
  selectSkillsData,
} from "@store/slices/skillsDataSlice";

export const SkillsList = () => {
  const dispatch = useAppDispatch();
  const { skills, likes, isLoading } = useAppSelector(selectSkillsData);

  useEffect(() => {
    if (skills.length === 0) {
      dispatch(fetchSkillsData());
    }
  }, [dispatch, skills.length]);

  // ...
};
```

#### Работа с лайками

```typescript
import { useAppDispatch } from '@store/hooks';
import { createLike, deleteLike } from '@store/slices/skillsDataSlice';

export const LikeButton = ({ skillId }: { skillId: number }) => {
  const dispatch = useAppDispatch();
  const { likes } = useAppSelector(selectSkillsData);
  const isLiked = likes.some(like => like.skillId === skillId);

  const handleToggle = async () => {
    if (isLiked) {
      await dispatch(deleteLike(skillId));
    } else {
      await dispatch(createLike(skillId));
    }
  };

  return (
    <button onClick={handleToggle}>
      {isLiked ? '❤️' : '🤍'}
    </button>
  );
};
```

#### Прямое использование API

```typescript
import { api } from "@/shared/api/api";

// Получить все навыки
const skills = await api.getSkills();

// Получить навыки с фильтрами
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

// Обновить навык
const updatedSkill = await api.updateSkill(1, {
  title: "Новое название",
  description: "Новое описание",
});

// Удалить навык
await api.deleteSkill(1);
```

### Categories (Категории)

#### Использование через слайсы

```typescript
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  fetchReferenceData,
  selectReferenceData,
} from "@store/slices/referenceDataSlice";

export const CategoriesList = () => {
  const dispatch = useAppDispatch();
  const { categories, isLoading } = useAppSelector(selectReferenceData);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchReferenceData());
    }
  }, [dispatch, categories.length]);

  // ...
};
```

#### Прямое использование API

```typescript
import { api } from "@/shared/api/api";

// Получить все категории
const categories = await api.getCategories();

// Получить категорию по ID
const category = await api.getCategory(1);
```

### Subcategories (Подкатегории)

```typescript
import { api } from "@/shared/api/api";

// Получить все подкатегории
const subcategories = await api.getSubcategories();

// Получить подкатегории по категории
const subcategories = await api.getSubcategories({ categoryId: 1 });

// Получить подкатегорию по ID
const subcategory = await api.getSubcategory(1);
```

### Cities (Города)

```typescript
import { api } from "@/shared/api/api";

// Получить все города
const cities = await api.getCities();

// Получить город по ID
const city = await api.getCity(1);
```

### Likes (Лайки)

```typescript
import { api } from "@/shared/api/api";

// Получить все лайки
const likes = await api.getLikes();

// Получить лайки с фильтрами
const likes = await api.getLikes({ userId: 1, skillId: 5 });

// Создать лайк
const like = await api.createLike({ skillId: 5 });

// Удалить лайк по ID
await api.deleteLike(1);

// Удалить лайк по skillId
await api.deleteLikeBySkillId(5);
```

## Полный пример настройки store

```typescript
// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersDataReducer from "./slices/usersDataSlice";
import referenceDataReducer from "./slices/referenceDataSlice";
import skillsDataReducer from "./slices/skillsDataSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    usersData: usersDataReducer,
    referenceData: referenceDataReducer,
    skillsData: skillsDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

## Обработка ошибок

### Класс ApiError

API выбрасывает `ApiError` с информацией о статусе:

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

### Обработка ошибок в слайсах

Ошибки автоматически сохраняются в состояние слайса:

```typescript
import { useAppSelector } from '@store/hooks';
import { selectUsersData } from '@store/slices/usersDataSlice';

export const UsersList = () => {
  const { users, isLoading, error } = useAppSelector(selectUsersData);

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  // ...
};
```

## Health Check

```typescript
import { api } from "@/shared/api/api";

const health = await api.healthCheck();
console.log(health.status, health.message);
```

## Селекторы

### Авторизация

```typescript
import { useAppSelector } from "@store/hooks";
import {
  selectAuth,
  selectIsAuthenticated,
  selectUser,
} from "@store/slices/authSlice";

export const Profile = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const auth = useAppSelector(selectAuth);

  // ...
};
```

### Пользователи

```typescript
import { selectUsersData } from "@store/slices/usersDataSlice";

const { users, isLoading } = useAppSelector(selectUsersData);
```

### Навыки и лайки

```typescript
import { selectSkillsData } from "@store/slices/skillsDataSlice";

const { skills, likes, isLoading } = useAppSelector(selectSkillsData);
```

### Справочные данные

```typescript
import { selectReferenceData } from "@store/slices/referenceDataSlice";

const { cities, categories, subcategories, isLoading } =
  useAppSelector(selectReferenceData);
```

## Примеры использования

### Регистрация и вход

```typescript
// src/components/Auth.tsx
import { useState } from 'react';
import { useAppDispatch } from '@store/hooks';
import { login, register } from '@store/slices/authSlice';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await dispatch(login({ email, password })).unwrap();
      } else {
        await dispatch(register({ email, password, name })).unwrap();
      }
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя"
          required
        />
      )}
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
      <button type="submit">
        {isLogin ? 'Войти' : 'Зарегистрироваться'}
      </button>
    </form>
  );
};
```

### Выход

```typescript
import { useAppDispatch } from '@store/hooks';
import { logout } from '@store/slices/authSlice';

export const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
    window.location.href = '/login';
  };

  return <button onClick={handleLogout}>Выйти</button>;
};
```

## Защищенные маршруты

```typescript
// src/app/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@store/hooks";
import { selectIsAuthenticated } from "@store/slices/authSlice";

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

## Важные замечания

1. **Токены**:
   - `accessToken` хранится в cookies (автоматически отправляется с запросами)
   - `refreshToken` хранится в localStorage (используется только для обновления)

2. **Автоматическое обновление**: Токен обновляется автоматически при получении ошибки 403

3. **Обработка ошибок**: Все ошибки обрабатываются в слайсах через `rejectWithValue`

4. **Типы**: Все типы находятся в `src/shared/types/types.ts`

5. **Переменные окружения**: Обязательно настройте `VITE_API_BASE_URL` в `.env`

## Структура файлов

```
src/
├── shared/
│   ├── api/
│   │   └── api.ts              # Основной API файл
│   ├── lib/
│   │   └── cookies.ts          # Утилиты для работы с cookies
│   └── types/
│       └── types.ts             # Все типы
└── store/
    ├── store.ts                 # Настройка Redux store
    └── slices/
        ├── authSlice.ts         # Авторизация
        ├── usersDataSlice.ts    # Пользователи
        ├── skillsDataSlice.ts   # Навыки и лайки
        └── referenceDataSlice.ts # Справочные данные
```
