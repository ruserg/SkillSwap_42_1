# Skills Data Slice

Документация по слайсу навыков и лайков.

## Обзор

`skillsDataSlice` управляет данными навыков и лайков, загруженными с сервера.

## Состояние

```typescript
type SkillsDataState = {
  skills: TSkill[];
  likes: TLike[];
  isLoading: boolean;
  error: string | null;
};
```

## Начальное состояние

```typescript
const initialState: SkillsDataState = {
  skills: [],
  likes: [],
  isLoading: false,
  error: null,
};
```

## Thunks

### fetchSkillsData

Загрузка всех навыков и лайков с сервера.

```typescript
import { fetchSkillsData } from "@store/slices/skillsDataSlice";

const dispatch = useAppDispatch();
await dispatch(fetchSkillsData());
```

**Действия:**

- `fetchSkillsData.pending` - начало загрузки
- `fetchSkillsData.fulfilled` - успешная загрузка, сохраняет навыки и лайки
- `fetchSkillsData.rejected` - ошибка загрузки

**Особенности:**

- Загружает навыки и лайки параллельно через `Promise.all`
- Оптимизировано для быстрой загрузки

### createLike

Создание лайка для навыка.

```typescript
import { createLike } from "@store/slices/skillsDataSlice";

const dispatch = useAppDispatch();
await dispatch(createLike(skillId));
```

**Действия:**

- `createLike.fulfilled` - успешное создание, добавляет лайк в state
- `createLike.rejected` - ошибка создания

**Примечание:** Лайк добавляется в массив `likes` автоматически.

### deleteLike

Удаление лайка по skillId.

```typescript
import { deleteLike } from "@store/slices/skillsDataSlice";

const dispatch = useAppDispatch();
await dispatch(deleteLike(skillId));
```

**Действия:**

- `deleteLike.fulfilled` - успешное удаление, удаляет лайк из state
- `deleteLike.rejected` - ошибка удаления

**Примечание:** Удаляются все лайки для указанного skillId.

## Reducers

### clearError

Очистка ошибки.

```typescript
import { clearError } from "@store/slices/skillsDataSlice";

const dispatch = useAppDispatch();
dispatch(clearError());
```

## Селекторы

### selectSkillsData

Все данные навыков и лайков.

```typescript
import { selectSkillsData } from "@store/slices/skillsDataSlice";

const { skills, likes, isLoading } = useAppSelector(selectSkillsData);
```

## Примеры использования

### Загрузка данных

```typescript
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  fetchSkillsData,
  selectSkillsData,
} from "@store/slices/skillsDataSlice";

export const SkillsList = () => {
  const dispatch = useAppDispatch();
  const { skills, likes, isLoading } = useAppSelector(selectSkillsData);

  useEffect(() => {
    if (skills.length === 0 && !isLoading) {
      dispatch(fetchSkillsData());
    }
  }, [dispatch, skills.length, isLoading]);

  // ...
};
```

### Работа с лайками

```typescript
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { createLike, deleteLike, selectSkillsData } from '@store/slices/skillsDataSlice';

export const LikeButton = ({ skillId }: { skillId: number }) => {
  const dispatch = useAppDispatch();
  const { likes } = useAppSelector(selectSkillsData);

  // Проверка, лайкнут ли навык текущим пользователем
  const currentUserId = useAppSelector(selectUser)?.id;
  const isLiked = likes.some(
    like => like.skillId === skillId && like.userId === currentUserId
  );

  const handleToggle = async () => {
    if (isLiked) {
      await dispatch(deleteLike(skillId));
    } else {
      await dispatch(createLike(skillId));
    }
  };

  return (
    <button onClick={handleToggle}>
      {isLiked ? 'Liked' : 'Not liked'}
    </button>
  );
};
```

### Подсчет лайков для пользователя

```typescript
import { useAppSelector } from '@store/hooks';
import { selectSkillsData } from '@store/slices/skillsDataSlice';
import { selectUsersData } from '@store/slices/usersDataSlice';

export const UserStats = ({ userId }: { userId: number }) => {
  const { skills, likes } = useAppSelector(selectSkillsData);

  // Навыки пользователя
  const userSkills = skills.filter(skill => skill.userId === userId);

  // Подсчет лайков
  const totalLikes = userSkills.reduce((total, skill) => {
    const skillLikes = likes.filter(like => like.skillId === skill.id);
    return total + skillLikes.length;
  }, 0);

  return <div>Всего лайков: {totalLikes}</div>;
};
```

### Фильтрация навыков

```typescript
import { useAppSelector } from '@store/hooks';
import { selectSkillsData } from '@store/slices/skillsDataSlice';

export const UserSkills = ({ userId }: { userId: number }) => {
  const { skills } = useAppSelector(selectSkillsData);

  const userSkills = skills.filter(skill => skill.userId === userId);
  const offers = userSkills.filter(skill => skill.type_of_proposal === 'учу');
  const requests = userSkills.filter(skill => skill.type_of_proposal === 'учусь');

  return (
    <div>
      <h3>Предлагаю научить ({offers.length})</h3>
      <h3>Хочу научиться ({requests.length})</h3>
    </div>
  );
};
```

## Оптимизация

### Мемоизация вычислений

Используйте `useMemo` для тяжелых вычислений:

```typescript
const userSkills = useMemo(() => {
  return skills.filter((skill) => skill.userId === userId);
}, [skills, userId]);

const totalLikes = useMemo(() => {
  return userSkills.reduce((total, skill) => {
    const skillLikes = likes.filter((like) => like.skillId === skill.id);
    return total + skillLikes.length;
  }, 0);
}, [userSkills, likes]);
```

## Следующие шаги

- [Users Data Slice](./users-data-slice.md) - работа с пользователями
- [useFilteredUsers](../hooks/use-filtered-users.md) - фильтрация с использованием навыков
- [Обзор Store](./overview.md) - общая информация
