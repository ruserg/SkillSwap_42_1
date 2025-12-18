# Типы фильтров

Документация по типам, используемым для фильтрации.

## TFilterState

Основной тип состояния фильтров.

```typescript
export interface TFilterState {
  purpose: string;
  skills: number[];
  gender: string;
  cityAll: number[];
}
```

**Поля:**

- `purpose` - цель поиска ("Всё" | "Хочу научиться" | "Хочу научить")
- `skills` - массив ID подкатегорий
- `gender` - пол ("Не имеет значения" | "Мужчины" | "Женщины")
- `cityAll` - массив ID городов

### Начальное состояние

```typescript
const initialFilters: TFilterState = {
  purpose: "",
  skills: [],
  gender: "",
  cityAll: [],
};
```

## TPropsFilter

Тип для пропсов компонента Filter.

```typescript
export interface TPropsFilter {
  purpose: string[];
  skills: TCategory[];
  gender: string[];
  cityAll: TCity[];
}
```

**Использование:**

```typescript
const filterProps: TPropsFilter = {
  purpose: ["Всё", "Хочу научиться", "Хочу научить"],
  skills: categories,
  gender: ["Не имеет значения", "Мужчины", "Женщины"],
  cityAll: cities,
};
```

## Константы

### FILTER_CONFIG

Конфигурация фильтра.

```typescript
export const FILTER_CONFIG = {
  SKILLS_VISIBLE_COUNT: 5,
  CITIES_VISIBLE_COUNT: 5,
} as const;
```

**Использование:**

```typescript
import { FILTER_CONFIG } from "@widgets/Filter/filter.type";

const visibleSkills = skills.slice(0, FILTER_CONFIG.SKILLS_VISIBLE_COUNT);
```

## Использование

### Управление состоянием

```typescript
import { useState } from "react";
import type { TFilterState } from "@widgets/Filter/filter.type";

const [filters, setFilters] = useState<TFilterState>({
  purpose: "",
  skills: [],
  gender: "",
  cityAll: [],
});
```

### Обновление фильтров

```typescript
// Добавить навык
setFilters((prev) => ({
  ...prev,
  skills: [...prev.skills, subcategoryId],
}));

// Удалить навык
setFilters((prev) => ({
  ...prev,
  skills: prev.skills.filter((id) => id !== subcategoryId),
}));

// Изменить цель
setFilters((prev) => ({
  ...prev,
  purpose: "Хочу научиться",
}));
```

### Проверка активных фильтров

```typescript
const hasActiveFilters =
  filters.purpose !== "" ||
  filters.skills.length > 0 ||
  filters.gender !== "" ||
  filters.cityAll.length > 0;
```

## Маппинг значений

### Пол

```typescript
const genderMap: Record<string, string> = {
  Мужчины: "M",
  Женщины: "F",
};

const targetGender = genderMap[filters.gender];
```

### Цель

```typescript
const purposeMap: Record<string, "учу" | "учусь"> = {
  "Хочу научиться": "учу", // Ищем тех, кто может научить
  "Хочу научить": "учусь", // Ищем тех, кто хочет научиться
};

const targetType = purposeMap[filters.purpose];
```

## Следующие шаги

- [Filter](../widgets/filter.md) - виджет фильтрации
- [useFilteredUsers](../hooks/use-filtered-users.md) - логика фильтрации
- [UserCardsSection](../widgets/user-cards-section.md) - использование фильтров
