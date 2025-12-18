# Основные типы

Документация по основным TypeScript типам проекта.

## Пользователи

### TUser

Основной тип пользователя.

```typescript
export type TUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  likes: number;
  cityId: number;
  dateOfBirth: Date;
  gender: Gender;
  dateOfRegistration: Date;
  lastLoginDatetime: Date;
  images?: string[];
};
```

**Поля:**

- `id` - уникальный идентификатор
- `name` - имя пользователя
- `username` - имя пользователя (логин)
- `email` - email адрес
- `avatarUrl` - URL аватара
- `likes` - количество лайков (временное решение)
- `cityId` - ID города
- `dateOfBirth` - дата рождения
- `gender` - пол ("M" | "F")
- `dateOfRegistration` - дата регистрации
- `lastLoginDatetime` - дата последнего входа
- `images` - дополнительные изображения (опционально)

### UserWithLikes

Пользователь с подсчитанным количеством лайков.

```typescript
export type UserWithLikes = TUser & { likesCount: number };
```

**Использование:**

```typescript
const user: UserWithLikes = {
  ...baseUser,
  likesCount: 42,
};
```

### Gender

Тип пола пользователя.

```typescript
export type Gender = "M" | "F";
```

## Навыки

### TSkill

Тип навыка (предложения).

```typescript
export type TSkill = {
  id: number;
  subcategoryId: number;
  userId: number;
  name: string;
  description: string;
  type_of_proposal: TypeOfProposal;
  images: string[];
  modified_datetime: Date;
};
```

**Поля:**

- `id` - уникальный идентификатор
- `subcategoryId` - ID подкатегории
- `userId` - ID пользователя-владельца
- `name` - название навыка
- `description` - описание навыка
- `type_of_proposal` - тип предложения
- `images` - массив URL изображений
- `modified_datetime` - дата последнего изменения

### TypeOfProposal

Тип предложения навыка.

```typescript
export type TypeOfProposal = "учу" | "учусь";
```

**Значения:**

- `"учу"` - пользователь может научить этому навыку
- `"учусь"` - пользователь хочет научиться этому навыку

## Лайки

### TLike

Тип лайка.

```typescript
export type TLike = {
  id: number;
  userId: number;
  skillId: number;
};
```

**Поля:**

- `id` - уникальный идентификатор лайка
- `userId` - ID пользователя, который поставил лайк
- `skillId` - ID навыка, который лайкнули

## Справочные данные

### TCategory

Категория навыков.

```typescript
export type TCategory = {
  id: number;
  name: string;
};
```

**Примеры:**

- Музыка
- Языки
- Спорт
- Кулинария

### TSubcategory

Подкатегория навыков.

```typescript
export type TSubcategory = {
  id: number;
  categoryId: number;
  name: string;
};
```

**Поля:**

- `id` - уникальный идентификатор
- `categoryId` - ID родительской категории
- `name` - название подкатегории

**Примеры:**

- Гитара (категория: Музыка)
- Английский язык (категория: Языки)

### TCity

Город.

```typescript
export type TCity = {
  id: number;
  name: string;
};
```

**Примеры:**

- Москва
- Санкт-Петербург
- Новосибирск

## Использование типов

### Импорт

```typescript
import type {
  TUser,
  TSkill,
  TLike,
  TCategory,
  TSubcategory,
  TCity,
  UserWithLikes,
  Gender,
  TypeOfProposal,
} from "@/shared/types/types";
```

### Типизация компонентов

```typescript
interface UserCardProps {
  user: TUser;
  cities: TCity[];
}

export const UserCard: React.FC<UserCardProps> = ({ user, cities }) => {
  // ...
};
```

### Типизация функций

```typescript
const getUserSkills = (userId: number, skills: TSkill[]): TSkill[] => {
  return skills.filter((skill) => skill.userId === userId);
};
```

### Типизация хуков

```typescript
const useUserSkills = (userId: number) => {
  const { skills } = useAppSelector(selectSkillsData);

  return useMemo(() => {
    return skills.filter((skill) => skill.userId === userId);
  }, [skills, userId]);
};
```

## Преобразование типов

### Преобразование дат

При получении данных с сервера даты приходят как строки. Селекторы автоматически преобразуют их:

```typescript
// С сервера
{
  dateOfBirth: "2000-01-01T00:00:00.000Z";
}

// После селектора
{
  dateOfBirth: new Date("2000-01-01T00:00:00.000Z");
}
```

### Добавление вычисляемых полей

```typescript
const userWithLikes: UserWithLikes = {
  ...user,
  likesCount: calculateLikes(user.id, skills, likes),
};
```

## Следующие шаги

- [Типы авторизации](./auth-types.md) - типы для авторизации
- [Типы фильтров](./filter-types.md) - типы для фильтрации
- [API](../api/overview.md) - использование типов в API
