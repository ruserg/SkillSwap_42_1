# Users Data Slice

Документация по слайсу данных пользователей.

## Обзор

`usersDataSlice` управляет данными пользователей, загруженными с сервера.

## Состояние

```typescript
type UsersDataState = {
  users: TUser[];
  isLoading: boolean;
  error: string | null;
};
```

## Начальное состояние

```typescript
const initialState: UsersDataState = {
  users: [],
  isLoading: false,
  error: null,
};
```

## Thunks

### fetchUsersData

Загрузка всех пользователей с сервера.

```typescript
import { fetchUsersData } from "@store/slices/usersDataSlice";

const dispatch = useAppDispatch();
await dispatch(fetchUsersData());
```

**Действия:**

- `fetchUsersData.pending` - начало загрузки
- `fetchUsersData.fulfilled` - успешная загрузка, сохраняет пользователей
- `fetchUsersData.rejected` - ошибка загрузки

## Reducers

### clearError

Очистка ошибки.

```typescript
import { clearError } from "@store/slices/usersDataSlice";

const dispatch = useAppDispatch();
dispatch(clearError());
```

## Селекторы

### selectUsersData

Все данные пользователей с состоянием загрузки.

```typescript
import { selectUsersData } from "@store/slices/usersDataSlice";

const { users, isLoading } = useAppSelector(selectUsersData);
```

### selectUsers

Только пользователи (с преобразованием дат).

```typescript
import { selectUsers } from "@store/slices/usersDataSlice";

const users = useAppSelector(selectUsers);
// TUser[] с Date объектами вместо строк
```

**Примечание:** Селектор преобразует строковые даты в объекты Date для удобства работы.

## Примеры использования

### Загрузка пользователей

```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchUsersData, selectUsersData } from '@store/slices/usersDataSlice';

export const UsersList = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector(selectUsersData);

  useEffect(() => {
    if (users.length === 0 && !isLoading) {
      dispatch(fetchUsersData());
    }
  }, [dispatch, users.length, isLoading]);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

### Использование с другими данными

Часто используется вместе с `skillsDataSlice` для подсчета лайков:

```typescript
import { selectUsersData } from "@store/slices/usersDataSlice";
import { selectSkillsData } from "@store/slices/skillsDataSlice";

const { users } = useAppSelector(selectUsersData);
const { skills, likes } = useAppSelector(selectSkillsData);

// Подсчет лайков для каждого пользователя
const usersWithLikes = useMemo(() => {
  // Логика подсчета
}, [users, skills, likes]);
```

## Оптимизация загрузки

Данные загружаются только если их еще нет:

```typescript
useEffect(() => {
  if (users.length === 0 && !isLoading) {
    dispatch(fetchUsersData());
  }
}, [dispatch, users.length, isLoading]);
```

Это предотвращает повторные загрузки при ре-рендерах.

## Следующие шаги

- [Skills Data Slice](./skills-data-slice.md) - работа с навыками
- [UserCardsSection](../widgets/user-cards-section.md) - использование данных
- [Обзор Store](./overview.md) - общая информация
