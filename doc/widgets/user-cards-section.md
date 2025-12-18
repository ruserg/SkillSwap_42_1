# Виджет UserCardsSection

Секция с карточками пользователей и фильтрацией.

## Обзор

Виджет `UserCardsSection` (`src/widgets/UserCardsSection/UserCardsSection.tsx`) отображает пользователей в трех секциях с поддержкой фильтрации.

## Импорт

```typescript
import { UserCardsSection } from "@widgets/UserCardsSection/UserCardsSection";
```

## Пропсы

```typescript
interface UserCardsSectionProps {
  filters: TFilterState;
  onFiltersChange: (filters: TFilterState) => void;
}
```

## Секции

### 1. Популярное

Пользователи, отсортированные по количеству лайков (от большего к меньшему).

**Особенности:**

- По умолчанию показывает 3 пользователя
- Кнопка "Показать все" для загрузки дополнительных
- Автоматический подсчет лайков по навыкам пользователя

### 2. Новое

Пользователи, отсортированные по дате регистрации (от новых к старым).

**Особенности:**

- По умолчанию показывает 3 пользователя
- Кнопка "Показать все" для загрузки дополнительных

### 3. Рекомендуем

Пользователи, которые не входят в секции "Популярное" и "Новое".

**Особенности:**

- Показывает топ-6 пользователей по лайкам
- Исключает уже показанных пользователей
- Не имеет кнопки "Показать все"

## Фильтрация

При наличии активных фильтров показывается одна секция "Подходящие предложения":

- Отображает отфильтрованных пользователей
- Показывает количество найденных предложений
- Компонент `ActiveFilters` для управления фильтрами

## Использование

### Базовый пример

```typescript
import { useState } from 'react';
import { UserCardsSection } from '@widgets/UserCardsSection/UserCardsSection';
import type { TFilterState } from '@widgets/Filter/filter.type';

export const MainPage = () => {
  const [filters, setFilters] = useState<TFilterState>({
    purpose: '',
    skills: [],
    gender: '',
    cityAll: [],
  });

  return (
    <UserCardsSection
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
};
```

## Логика работы

### Загрузка данных

Виджет автоматически загружает данные при монтировании:

```typescript
useEffect(() => {
  if (users.length === 0 && !usersLoading) {
    dispatch(fetchUsersData());
  }
  if (skills.length === 0 && !skillsLoading) {
    dispatch(fetchSkillsData());
  }
}, [dispatch, users.length, usersLoading, skills.length, skillsLoading]);
```

### Подсчет лайков

Лайки подсчитываются для каждого пользователя:

```typescript
const usersWithLikes = useMemo(() => {
  const likesBySkillId = new Map<number, number>();
  likes.forEach((like) => {
    const currentCount = likesBySkillId.get(like.skillId) || 0;
    likesBySkillId.set(like.skillId, currentCount + 1);
  });

  return users.map((user) => {
    const userSkills = skills.filter((skill) => skill.userId === user.id);
    const likesCount = userSkills.reduce((total, skill) => {
      return total + (likesBySkillId.get(skill.id) || 0);
    }, 0);

    return {
      ...user,
      likesCount,
    } as UserWithLikes;
  });
}, [users, skills, likes]);
```

### Фильтрация

Используется хук `useFilteredUsers`:

```typescript
const { filteredOffers, filteredUsers, hasActiveFilters } = useFilteredUsers({
  filters,
  usersWithLikes,
  skills,
});
```

## Состояние загрузки

При загрузке показываются скелетоны:

```typescript
if (isLoading) {
  return (
    <div className={styles.container}>
      {hasActiveFilters ? (
        // Скелетоны для отфильтрованных результатов
      ) : (
        // Скелетоны для всех секций
      )}
    </div>
  );
}
```

## Управление количеством элементов

Используется состояние для отслеживания количества показываемых элементов:

```typescript
const [popularCount, setPopularCount] = useState(3);
const [newCount, setNewCount] = useState(3);
```

Кнопка "Показать все" увеличивает количество:

```typescript
<ViewAllButton
  behavior="hide"
  initialCount={3}
  currentCount={popularCount}
  totalCount={allPopularUsers.length}
  onLoadMore={setPopularCount}
/>
```

## Интеграция с фильтрами

Виджет получает фильтры из родительского компонента и передает их в хук фильтрации. При изменении фильтров автоматически обновляется отображение.

## Стилизация

Стили находятся в `userCardsSection.module.scss`:

- Сетка карточек
- Стили секций
- Адаптивная верстка

## Следующие шаги

- [Filter](./filter.md) - виджет фильтрации
- [useFilteredUsers](../hooks/use-filtered-users.md) - логика фильтрации
- [Card](../components/ui-components.md#card) - компонент карточки
