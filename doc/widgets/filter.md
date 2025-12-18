# Виджет Filter

Виджет фильтрации пользователей и навыков.

## Обзор

Виджет `Filter` (`src/widgets/Filter/Filter.tsx`) предоставляет интерфейс для фильтрации пользователей по различным критериям.

## Импорт

```typescript
import { Filter } from "@widgets/Filter/Filter";
```

## Пропсы

```typescript
interface FilterProps {
  filters: TFilterState;
  onFiltersChange: (filters: TFilterState) => void;
  onClearSearchQuery?: () => void;
}
```

## Типы фильтров

```typescript
interface TFilterState {
  purpose: string; // "Всё" | "Хочу научиться" | "Хочу научить"
  skills: number[]; // Массив ID подкатегорий
  gender: string; // "Не имеет значения" | "Мужчины" | "Женщины"
  cityAll: number[]; // Массив ID городов
}
```

## Функциональность

### 1. Фильтр по цели (Purpose)

- **Всё** - показать все предложения
- **Хочу научиться** - найти тех, кто может научить
- **Хочу научить** - найти тех, кто хочет научиться

### 2. Фильтр по навыкам

- Иерархическая структура: Категории → Подкатегории
- Поиск по названию подкатегории
- Множественный выбор
- Ограничение видимых элементов (по умолчанию 5)
- Кнопка "Показать все"

### 3. Фильтр по полу

- Не имеет значения
- Мужчины
- Женщины

### 4. Фильтр по городам

- Список всех городов
- Поиск по названию города
- Множественный выбор
- Ограничение видимых элементов (по умолчанию 5)
- Кнопка "Показать все"

## Использование

### Базовый пример

```typescript
import { useState } from 'react';
import { Filter } from '@widgets/Filter/Filter';
import type { TFilterState } from '@widgets/Filter/filter.type';

export const MainPage = () => {
  const [filters, setFilters] = useState<TFilterState>({
    purpose: '',
    skills: [],
    gender: '',
    cityAll: [],
  });

  return (
    <Filter
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
};
```

### С обработкой поискового запроса

```typescript
import { useSearchParams } from 'react-router-dom';

export const MainPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<TFilterState>({
    purpose: '',
    skills: [],
    gender: '',
    cityAll: [],
  });

  const clearSearchQuery = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    setSearchParams(newParams);
  };

  return (
    <Filter
      filters={filters}
      onFiltersChange={setFilters}
      onClearSearchQuery={clearSearchQuery}
    />
  );
};
```

## Интеграция с данными

Виджет автоматически загружает справочные данные через Redux:

```typescript
// Автоматически загружает при монтировании
useEffect(() => {
  if (categories.length === 0 && !isLoading) {
    dispatch(fetchReferenceData());
  }
}, [dispatch, categories.length, isLoading]);
```

## Состояние загрузки

Виджет показывает скелетон при загрузке данных:

```typescript
{isLoading ? (
  <FilterSkeleton />
) : (
  <Filter {...props} />
)}
```

## Конфигурация

Константы фильтра определены в `filter.type.ts`:

```typescript
export const FILTER_CONFIG = {
  SKILLS_VISIBLE_COUNT: 5, // Количество видимых навыков
  CITIES_VISIBLE_COUNT: 5, // Количество видимых городов
} as const;
```

## Внутренняя логика

### Раскрытие категорий

Виджет управляет состоянием раскрытых категорий:

```typescript
const [showSubcategorys, setShowSubcategorys] = useState<number[]>([]);

const toggleCategory = (categoryId: number) => {
  setShowSubcategorys((prev) =>
    prev.includes(categoryId)
      ? prev.filter((id) => id !== categoryId)
      : [...prev, categoryId],
  );
};
```

### Поиск

Поиск работает по названиям подкатегорий и городов:

```typescript
const filteredSubcategories = subcategories.filter((sub) =>
  sub.name.toLowerCase().includes(searchTerm.toLowerCase()),
);
```

## Стилизация

Стили находятся в `filter.module.scss`:

- Адаптивная верстка
- Анимации раскрытия
- Стили для активных фильтров

## Следующие шаги

- [UserCardsSection](./user-cards-section.md) - использование фильтров
- [useFilteredUsers](../hooks/use-filtered-users.md) - логика фильтрации
- [Типы фильтров](../types/filter-types.md) - детали типов
