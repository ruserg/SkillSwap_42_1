# Роутинг

Документация по настройке и использованию маршрутов в приложении.

## Конфигурация

Маршруты определены в `src/app/Routes.tsx`:

```typescript
import { Routes, Route } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./ProtectedRoute";
import { MainPage } from "@pages/MainPage/MainPage";
```

## Доступные маршруты

### Публичные маршруты

```typescript
/                    - Главная страница
/signup             - Регистрация (шаг 1)
/signup/step-2      - Регистрация (шаг 2)
/signup/step-3      - Регистрация (шаг 3)
/login              - Вход
/500                - Ошибка сервера
/*                  - 404 страница
```

### Защищенные маршруты

```typescript
/favorites          - Избранное (список лайкнутых пользователей)
/profile            - Профиль пользователя
/create-offer        - Создание предложения
```

## Защищенные маршруты

### ProtectedRoute

Компонент для защиты маршрутов:

```typescript
// src/app/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import { selectAuth } from "@features/auth/model/slice";
import { getCookie } from "@shared/lib/cookies";

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAppSelector(selectAuth);
  const hasToken = !!getCookie("accessToken");
  const location = useLocation();

  // Если нет токена или пользователя, редиректим на логин
  // Проверка загрузки пользователя уже происходит в App.tsx
  if (!hasToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

**Важно:** Проверка авторизации централизована в `App.tsx`. Если есть токен, но пользователь еще не загружен, `App.tsx` ждет завершения загрузки перед рендером роутов. Это предотвращает редиректы во время загрузки пользователя.

### Использование

```typescript
<Route
  path="favorites"
  element={
    <ProtectedRoute>
      <Favorites />
    </ProtectedRoute>
  }
/>
```

**Особенности:**

- Автоматически проверяет авторизацию через Redux
- Сохраняет текущий путь для редиректа после входа
- Использует `replace` для замены истории

## Навигация

### useNavigate

Программная навигация:

```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Переход на страницу
navigate("/profile");

// Переход с состоянием
navigate("/profile", { state: { from: "home" } });

// Назад
navigate(-1);
```

### Link

Навигация через ссылки:

```typescript
import { Link } from 'react-router-dom';

<Link to="/profile">Профиль</Link>
```

### NavLink

Активная ссылка:

```typescript
import { NavLink } from 'react-router-dom';

<NavLink
  to="/profile"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Профиль
</NavLink>
```

## URL параметры

### useParams

Получение параметров маршрута:

```typescript
import { useParams } from "react-router-dom";

// Маршрут: /user/:id
const { id } = useParams<{ id: string }>();
```

### useSearchParams

Работа с query параметрами:

```typescript
import { useSearchParams } from "react-router-dom";

const [searchParams, setSearchParams] = useSearchParams();

// Получить параметр
const query = searchParams.get("q");

// Установить параметр
setSearchParams({ q: "search term" });

// Удалить параметр
const newParams = new URLSearchParams(searchParams);
newParams.delete("q");
setSearchParams(newParams);
```

### Пример использования

```typescript
// MainPage.tsx
const [searchParams, setSearchParams] = useSearchParams();

useEffect(() => {
  const searchQuery = searchParams.get("q");
  if (searchQuery) {
    // Обработка поискового запроса
  }
}, [searchParams]);
```

## Редиректы

### Navigate

Компонент для редиректов:

```typescript
import { Navigate } from 'react-router-dom';

// Условный редирект
{isAuthenticated ? (
  <Navigate to="/dashboard" replace />
) : (
  <LoginForm />
)}
```

### navigate

Программный редирект:

```typescript
const navigate = useNavigate();

// После успешного входа
await dispatch(login(credentials));
navigate("/dashboard", { replace: true });
```

## Состояние навигации

Передача состояния при навигации:

```typescript
// Отправка
navigate("/login", {
  state: { from: location.pathname },
});

// Получение
const location = useLocation();
const from = location.state?.from || "/";
```

**Использование в ProtectedRoute:**

```typescript
// Сохраняет текущий путь
<Navigate to="/login" state={{ from: location }} replace />
```

## Вложенные маршруты

Использование `Outlet` для вложенных маршрутов:

```typescript
// App.tsx
export default function App() {
  return (
    <>
      <Outlet />
    </>
  );
}
```

## Следующие шаги

- [Начало работы](./getting-started.md) - установка и настройка
- [Авторизация](../api/authentication.md) - работа с авторизацией
- [ProtectedRoute](../store/auth-slice.md) - детали защиты маршрутов
