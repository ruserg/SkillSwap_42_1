# Хук useFilteredUsers

Хук для фильтрации пользователей и навыков по заданным критериям.

## Обзор

Хук `useFilteredUsers` (`src/shared/hooks/useFilteredUsers.ts`) предоставляет логику фильтрации пользователей и их навыков.

## Импорт

```typescript
import { useFilteredUsers } from "@shared/hooks/useFilteredUsers";
```

## Параметры

```typescript
interface UseFilteredUsersParams {
  filters: TFilterState;
  usersWithLikes: UserWithLikes[];
  skills: TSkill[];
  sortByDate: boolean;
}
```

## Возвращаемые значения

```typescript
interface FilteredResult {
  filteredOffers: Array<{ skill: TSkill; user: UserWithLikes }>;
  sortedUsers: UserWithLikes[];
  hasActiveFilters: boolean;
}
```

## Логика фильтрации

### 1. Определение активных фильтров

```typescript
const hasActiveFilters =
  filters.purpose !== "" ||
  filters.skills.length > 0 ||
  filters.gender !== "" ||
  filters.cityAll.length > 0;
```

### 2. Фильтрация пользователей

#### По полу

```typescript
if (filters.gender !== "" && filters.gender !== "Не имеет значения") {
  const genderMap: Record<string, string> = {
    Мужчины: "M",
    Женщины: "F",
  };
  const targetGender = genderMap[filters.gender];
  if (targetGender) {
    filteredUsers = filteredUsers.filter(
      (user) => user.gender === targetGender,
    );
  }
}
```

#### По городам

```typescript
if (filters.cityAll.length > 0) {
  const cityIdsSet = new Set(filters.cityAll);
  filteredUsers = filteredUsers.filter((user) => cityIdsSet.has(user.cityId));
}
```

### 3. Фильтрация навыков

#### По цели (purpose)

```typescript
if (filters.purpose !== "" && filters.purpose !== "Всё") {
  const purposeMap: Record<string, "учу" | "учусь"> = {
    "Хочу научиться": "учу", // Ищем тех, кто может научить
    "Хочу научить": "учусь", // Ищем тех, кто хочет научиться
  };
  const targetType = purposeMap[filters.purpose];
  if (targetType && skill.type_of_proposal !== targetType) {
    return; // Пропускаем навык
  }
}
```

#### По подкатегориям (skills)

```typescript
if (filters.skills.length > 0) {
  if (!filters.skills.includes(skill.subcategoryId)) {
    return; // Пропускаем навык
  }
}
```

### 4. Формирование результата

Хук возвращает:

- **filteredOffers** - массив пар (навык, пользователь), прошедших все фильтры
- **filteredUsers** - уникальные пользователи из filteredOffers, отсортированные по дате регистрации
- **hasActiveFilters** - флаг наличия активных фильтров

## Использование

### Базовый пример

```typescript
import { useFilteredUsers } from '@shared/hooks/useFilteredUsers';

const MyComponent = () => {
  const { usersWithLikes, skills } = useAppSelector(/* ... */);
  const [filters, setFilters] = useState<TFilterState>({
    purpose: '',
    skills: [],
    gender: '',
    cityAll: [],
  });

  const { filteredOffers, filteredUsers, hasActiveFilters } = useFilteredUsers({
    filters,
    usersWithLikes,
    skills,
  });

  if (hasActiveFilters) {
    return (
      <div>
        <p>Найдено предложений: {filteredOffers.length}</p>
        {filteredUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    );
  }

  // Показать все пользователи без фильтров
};
```

### С отображением предложений

```typescript
const { filteredOffers, filteredUsers } = useFilteredUsers({
  filters,
  usersWithLikes,
  skills,
});

return (
  <div>
    {filteredOffers.map(({ skill, user }) => (
      <div key={`${user.id}-${skill.id}`}>
        <UserCard user={user} />
        <SkillCard skill={skill} />
      </div>
    ))}
  </div>
);
```

## Оптимизация

Хук использует `useMemo` для оптимизации вычислений:

```typescript
const filteredOffers = useMemo(() => {
  // Логика фильтрации
}, [hasActiveFilters, usersWithLikes, skills, filters]);

const filteredUsers = useMemo(() => {
  // Формирование списка пользователей
}, [filteredOffers]);
```

Это гарантирует, что фильтрация выполняется только при изменении зависимостей.

## Особенности

### Маппинг значений

Хук преобразует пользовательские значения в значения API:

- "Мужчины" → "M"
- "Женщины" → "F"
- "Хочу научиться" → "учу"
- "Хочу научить" → "учусь"

### Сортировка

Отфильтрованные пользователи сортируются по дате регистрации (от новых к старым):

```typescript
return Array.from(userMap.values()).sort(
  (a, b) =>
    new Date(b.dateOfRegistration).getTime() -
    new Date(a.dateOfRegistration).getTime(),
);
```

## Следующие шаги

- [Filter](../widgets/filter.md) - виджет фильтрации
- [UserCardsSection](../widgets/user-cards-section.md) - использование хука
- [Типы фильтров](../types/filter-types.md) - детали типов
