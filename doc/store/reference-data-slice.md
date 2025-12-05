# Reference Data Slice

Документация по слайсу справочных данных.

## Обзор

`referenceDataSlice` управляет справочными данными: городами, категориями и подкатегориями.

## Состояние

```typescript
type ReferenceDataState = {
  cities: TCity[];
  categories: TCategory[];
  subcategories: TSubcategory[];
  isLoading: boolean;
  error: string | null;
};
```

## Начальное состояние

```typescript
const initialState: ReferenceDataState = {
  cities: [],
  categories: [],
  subcategories: [],
  isLoading: false,
  error: null,
};
```

## Thunks

### fetchReferenceData

Загрузка всех справочных данных с сервера.

```typescript
import { fetchReferenceData } from "@store/slices/referenceDataSlice";

const dispatch = useAppDispatch();
await dispatch(fetchReferenceData());
```

**Действия:**

- `fetchReferenceData.pending` - начало загрузки
- `fetchReferenceData.fulfilled` - успешная загрузка:
  - Сохраняет города
  - Сохраняет категории
  - Сохраняет подкатегории
- `fetchReferenceData.rejected` - ошибка загрузки

**Особенности:**

- Загружает все данные параллельно через `Promise.all`
- Оптимизировано для быстрой загрузки

## Reducers

### clearError

Очистка ошибки.

```typescript
import { clearError } from "@store/slices/referenceDataSlice";

const dispatch = useAppDispatch();
dispatch(clearError());
```

## Селекторы

### selectReferenceData

Все справочные данные с состоянием загрузки.

```typescript
import { selectReferenceData } from "@store/slices/referenceDataSlice";

const { cities, categories, subcategories, isLoading } =
  useAppSelector(selectReferenceData);
```

## Примеры использования

### Загрузка данных

```typescript
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  fetchReferenceData,
  selectReferenceData,
} from "@store/slices/referenceDataSlice";

export const Filter = () => {
  const dispatch = useAppDispatch();
  const { cities, categories, subcategories, isLoading } =
    useAppSelector(selectReferenceData);

  useEffect(() => {
    if (categories.length === 0 && !isLoading) {
      dispatch(fetchReferenceData());
    }
  }, [dispatch, categories.length, isLoading]);

  // ...
};
```

### Работа с городами

```typescript
import { useAppSelector } from '@store/hooks';
import { selectReferenceData } from '@store/slices/referenceDataSlice';

export const CitySelector = () => {
  const { cities } = useAppSelector(selectReferenceData);

  return (
    <select>
      {cities.map(city => (
        <option key={city.id} value={city.id}>
          {city.name}
        </option>
      ))}
    </select>
  );
};
```

### Работа с категориями и подкатегориями

```typescript
import { useAppSelector } from '@store/hooks';
import { selectReferenceData } from '@store/slices/referenceDataSlice';

export const SkillsTree = () => {
  const { categories, subcategories } = useAppSelector(selectReferenceData);

  return (
    <div>
      {categories.map(category => {
        const categorySubcategories = subcategories.filter(
          sub => sub.categoryId === category.id
        );

        return (
          <div key={category.id}>
            <h3>{category.name}</h3>
            <ul>
              {categorySubcategories.map(sub => (
                <li key={sub.id}>{sub.name}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
```

### Поиск подкатегорий

```typescript
import { useAppSelector } from '@store/hooks';
import { selectReferenceData } from '@store/slices/referenceDataSlice';

export const SearchSkills = ({ query }: { query: string }) => {
  const { subcategories } = useAppSelector(selectReferenceData);

  const filtered = subcategories.filter(sub =>
    sub.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ul>
      {filtered.map(sub => (
        <li key={sub.id}>{sub.name}</li>
      ))}
    </ul>
  );
};
```

### Получение названия по ID

```typescript
import { useAppSelector } from '@store/hooks';
import { selectReferenceData } from '@store/slices/referenceDataSlice';

export const CityName = ({ cityId }: { cityId: number }) => {
  const { cities } = useAppSelector(selectReferenceData);

  const city = cities.find(c => c.id === cityId);
  return <span>{city?.name || 'Город не указан'}</span>;
};
```

## Оптимизация

### Мемоизация фильтрации

Используйте `useMemo` для фильтрации:

```typescript
const categorySubcategories = useMemo(() => {
  return subcategories.filter((sub) => sub.categoryId === categoryId);
}, [subcategories, categoryId]);
```

### Кеширование данных

Справочные данные загружаются один раз и кешируются в Redux. Не нужно загружать их повторно при каждом использовании.

## Следующие шаги

- [Filter](../widgets/filter.md) - использование справочных данных
- [Обзор Store](./overview.md) - общая информация
- [Типы](../types/main-types.md) - типы справочных данных
