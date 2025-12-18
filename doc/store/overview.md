# Redux Store - Обзор

Обзор структуры и работы Redux store в проекте.

## Структура Store

```typescript
{
  auth: AuthState,              // Авторизация (features/auth)
  usersData: UsersDataState,    // Пользователи (entities/user)
  categoryData: CategoryState,  // Категории (entities/category)
  cities: CityState,           // Города (entities/city)
  skillsData: SkillsDataState,  // Навыки (entities/skill)
  likes: LikesState,           // Лайки (entities/like)
  notifications: NotificationsState, // Уведомления (entities/notification)
  signup: SignupState,         // Состояние регистрации (features/signup)
}
```

## Конфигурация

### Store

```typescript
// src/app/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@features/auth/model/slice";
import { usersDataReducer } from "@entities/user/model/slice";
import { categoryReducer } from "@entities/category/model/slice";
import { cityReducer } from "@entities/city/model/slice";
import { skillsDataReducer } from "@entities/skill/model/slice";
import { likesReducer } from "@entities/like/model/slice";
import { notificationsReducer } from "@entities/notification/model/slice";
import { signupReducer } from "@features/signup/model/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    usersData: usersDataReducer,
    categoryData: categoryReducer,
    cities: cityReducer,
    skillsData: skillsDataReducer,
    likes: likesReducer,
    notifications: notificationsReducer,
    signup: signupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Провайдер

```typescript
// src/main.tsx
import { Provider } from 'react-redux';
import { store } from './app/store/store';

<Provider store={store}>
  <App />
</Provider>
```

## Типизированные хуки

### useAppDispatch

```typescript
import { useAppDispatch } from "@store/hooks";

const dispatch = useAppDispatch();
```

### useAppSelector

```typescript
import { useAppSelector } from "@store/hooks";

const users = useAppSelector(selectUsersData);
```

## Слайсы

### authSlice

Управление авторизацией.

**Состояние:**

```typescript
{
  user: User | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}
```

**Thunks:**

- `fetchUser` - загрузка текущего пользователя
- `login` - вход
- `register` - регистрация
- `logout` - выход

**Селекторы:**

- `selectAuth` - полное состояние
- `selectIsAuthenticated` - проверка авторизации
- `selectUser` - текущий пользователь

Подробнее: [Auth Slice](./auth-slice.md)

### usersDataSlice

Данные пользователей.

**Состояние:**

```typescript
{
  users: TUser[];
  isLoading: boolean;
  error: string | null;
}
```

**Thunks:**

- `fetchUsersData` - загрузка всех пользователей

**Селекторы:**

- `selectUsersData` - данные пользователей
- `selectUsers` - только пользователи

Подробнее: [Users Data Slice](./users-data-slice.md)

### skillsDataSlice

Навыки.

**Состояние:**

```typescript
{
  skills: TSkill[];
  isLoading: boolean;
  error: string | null;
}
```

**Thunks:**

- `fetchSkillsData` - загрузка навыков

**Селекторы:**

- `selectSkillsData` - все данные

Подробнее: [Skills Data Slice](./skills-data-slice.md)

### likesSlice

Лайки (от пользователя к пользователю).

**Состояние:**

```typescript
{
  usersLikesInfo: Record<number, TUserLikesInfo>;
  isLoading: boolean;
  error: string | null;
}
```

**Thunks:**

- `fetchUsersLikesInfo` - загрузка информации о лайках для нескольких пользователей
- `fetchUserLikesInfo` - загрузка информации о лайках одного пользователя
- `createLike` - создание лайка от текущего пользователя к другому
- `deleteLike` - удаление лайка

**Селекторы:**

- `selectUserLikesInfo` - информация о лайках одного пользователя
- `selectUsersLikesInfo` - информация о лайках нескольких пользователей

Подробнее: [Likes Slice](./likes-slice.md)

### categoryDataSlice

Категории и подкатегории.

**Состояние:**

```typescript
{
  categories: TCategory[];
  subcategories: TSubcategory[];
  isLoading: boolean;
  error: string | null;
}
```

**Thunks:**

- `fetchCategoryData` - загрузка категорий и подкатегорий

**Селекторы:**

- `selectCategoryData` - все данные

Подробнее: [Category Data Slice](./category-data-slice.md)

### citiesSlice

Города.

**Состояние:**

```typescript
{
  cities: TCity[];
  isLoading: boolean;
  error: string | null;
}
```

**Thunks:**

- `fetchCities` - загрузка городов

**Селекторы:**

- `selectCities` - все города

Подробнее: [City Data Slice](./city-data-slice.md)

### notificationsSlice

Уведомления пользователя.

**Состояние:**

```typescript
{
  notifications: INotification[];
  toast: INotification | null;
  isLoading: boolean;
  error: string | null;
}
```

**Thunks:**

- `fetchNotifications` - загрузка всех уведомлений
- `fetchUnreadNotifications` - загрузка непрочитанных уведомлений
- `fetchToastNotification` - загрузка тост-уведомления
- `fetchNotificationById` - загрузка уведомления по ID
- `markNotificationAsRead` - отметить уведомление как прочитанное
- `markAllNotificationsAsRead` - отметить все уведомления как прочитанные
- `deleteNotification` - удалить уведомление
- `deleteAllNotifications` - удалить все уведомления

**Селекторы:**

- `selectNotifications` - все уведомления
- `selectUnreadNotifications` - непрочитанные уведомления
- `selectUnreadNotificationsCount` - количество непрочитанных
- `selectToast` - текущее тост-уведомление
- `selectNotificationById` - уведомление по ID

**Actions:**

- `clearToast` - очистить тост
- `clearError` - очистить ошибку
- `markAsReadOptimistic` - оптимистичное обновление статуса прочитанности

**Важно:** Форматирование дат (`formattedDate`) выполняется на сервере. Все уведомления приходят с уже отформатированными датами в формате "сегодня", "вчера" или "dd.mm.YYYY".

Подробнее: [Notifications Slice](./notifications-slice.md)

## Работа с данными

### Загрузка данных

```typescript
import { useAppDispatch } from "@app/store/hooks";
import { fetchUsersData } from "@entities/user/model/slice";

const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(fetchUsersData());
}, [dispatch]);
```

### Получение данных

```typescript
import { useAppSelector } from "@app/store/hooks";
import { selectUsersData } from "@entities/user/model/slice";

const { users, isLoading, error } = useAppSelector(selectUsersData);
```

### Обновление данных

```typescript
import { useAppDispatch } from "@app/store/hooks";
import { createLike } from "@entities/like/model/slice";

const dispatch = useAppDispatch();

const handleLike = async () => {
  await dispatch(createLike({ toUserId: userId }));
  // Состояние автоматически обновится
};
```

## Обработка ошибок

Ошибки автоматически сохраняются в состояние слайса:

```typescript
const { error } = useAppSelector(selectUsersData);

if (error) {
  return <div>Ошибка: {error}</div>;
}
```

## Состояние загрузки

Все слайсы имеют состояние загрузки:

```typescript
const { isLoading } = useAppSelector(selectUsersData);

if (isLoading) {
  return <div>Загрузка...</div>;
}
```

## Следующие шаги

- [Auth Slice](./auth-slice.md) - детали авторизации
- [Users Data Slice](./users-data-slice.md) - работа с пользователями
- [Skills Data Slice](./skills-data-slice.md) - работа с навыками
- [Likes Slice](./likes-slice.md) - работа с лайками
- [Category Data Slice](./category-data-slice.md) - категории и подкатегории
- [City Data Slice](./city-data-slice.md) - города
- [Notifications Slice](./notifications-slice.md) - работа с уведомлениями
