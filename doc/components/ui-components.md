# UI Компоненты

Документация по переиспользуемым UI компонентам проекта.

## Button

Кнопка с различными вариантами стилизации.

### Импорт

```typescript
import { Button } from "@shared/ui/Button";
```

### Пропсы

```typescript
interface TButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "signup";
  htmlType?: "button" | "submit" | "reset";
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  to?: string; // Если указан, рендерится как Link
}
```

### Варианты

- **primary** (по умолчанию) - основная зеленая кнопка
- **secondary** - вторичная кнопка
- **tertiary** - третичная кнопка
- **signup** - кнопка для регистрации

### Примеры

```typescript
// Простая кнопка
<Button onClick={handleClick}>Нажми меня</Button>

// Кнопка с иконкой
<Button leftIcon={<Icon />}>С иконкой</Button>

// Кнопка-ссылка
<Button to="/profile">Профиль</Button>

// Отправка формы
<Button htmlType="submit" variant="primary">
  Отправить
</Button>

// Отключенная кнопка
<Button disabled>Недоступно</Button>
```

## Card

Карточка пользователя с информацией и навыками.

### Импорт

```typescript
import { Card } from "@shared/ui/Card";
```

### Пропсы

```typescript
interface CardProps {
  user: TUser;
  cities: TCity[];
  onDetailsClick: (user: TUser) => void;
  className?: string;
  isLoading?: boolean;
}
```

### Функциональность

- Отображение информации о пользователе
- Показ навыков пользователя
- Компонент лайка
- Кнопка просмотра деталей
- Автоматическая загрузка навыков
- Цветные теги для категорий навыков

### Пример

```typescript
<Card
  user={user}
  cities={cities}
  onDetailsClick={(user) => navigate(`/user/${user.id}`)}
/>
```

## Input

Поле ввода с поддержкой различных типов.

### Импорт

```typescript
import { Input } from "@shared/ui/Input";
```

### Пропсы

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password" | "number" | "date" | "search";
  // ... стандартные HTML атрибуты input
}
```

### Примеры

```typescript
// Текстовое поле
<Input
  type="text"
  placeholder="Введите имя"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Поле поиска
<Input
  type="search"
  placeholder="Поиск..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

// Поле пароля
<Input
  type="password"
  placeholder="Пароль"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

## Modal

Модальное окно.

### Импорт

```typescript
import { Modal } from "@shared/ui/Modal";
```

### Пропсы

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}
```

### Пример

```typescript
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Заголовок">
  <p>Содержимое модального окна</p>
</Modal>
```

## Like

Компонент лайка для навыков.

### Импорт

```typescript
import { Like } from "@shared/ui/Like";
```

### Пропсы

```typescript
interface LikeProps {
  skillId: number;
  initialLiked?: boolean;
  likesCount?: number;
}
```

### Функциональность

- Отображение состояния лайка
- Обработка клика для создания/удаления лайка
- Интеграция с Redux
- Обновление счетчика лайков

### Пример

```typescript
<Like skillId={5} initialLiked={false} likesCount={10} />
```

## Selector

Выпадающий список с поиском.

### Импорт

```typescript
import { Selector } from "@shared/ui/Selector";
```

### Пропсы

```typescript
interface SelectorProps {
  options: Array<{ id: number; name: string }>;
  selected: number[];
  onChange: (selected: number[]) => void;
  placeholder?: string;
  multiple?: boolean;
}
```

### Пример

```typescript
<Selector
  options={cities}
  selected={selectedCities}
  onChange={setSelectedCities}
  placeholder="Выберите города"
  multiple
/>
```

## ViewAllButton

Кнопка "Показать все" с управлением количеством элементов.

### Импорт

```typescript
import { ViewAllButton } from "@shared/ui/ViewAllButton";
```

### Пропсы

```typescript
interface ViewAllButtonProps {
  behavior: "hide" | "show";
  initialCount: number;
  currentCount: number;
  totalCount: number;
  onLoadMore: (count: number) => void;
}
```

### Поведение

- **hide** - скрывает кнопку при достижении максимума
- **show** - всегда показывает кнопку

### Пример

```typescript
<ViewAllButton
  behavior="hide"
  initialCount={3}
  currentCount={popularCount}
  totalCount={allPopularUsers.length}
  onLoadMore={setPopularCount}
/>
```

## CardSkeleton

Скелетон для карточки пользователя (загрузка).

### Импорт

```typescript
import { CardSkeleton } from "@shared/ui/CardSkeleton";
```

### Использование

```typescript
{isLoading ? (
  <CardSkeleton />
) : (
  <Card user={user} />
)}
```

## Separator

Разделитель.

### Импорт

```typescript
import { Separator } from "@shared/ui/Separator";
```

### Пример

```typescript
<div>
  <p>Текст 1</p>
  <Separator />
  <p>Текст 2</p>
</div>
```

## Logo

Логотип приложения.

### Импорт

```typescript
import { Logo } from "@shared/ui/Logo";
```

### Пример

```typescript
<Logo />
```

## Icons

Набор иконок проекта.

### Доступные иконки

- `AppleIcon` - иконка Apple
- `GoogleIcon` - иконка Google
- `ArrowLeftIcon` - стрелка влево
- `EditIcon` - редактирование
- `NotificationIcon` - уведомления
- `SuccessIcon` - успех

### Использование

```typescript
import { AppleIcon } from '@shared/ui/Icons/AppleIcon';

<AppleIcon />
```

## Следующие шаги

- [Виджеты](../widgets/filter.md) - крупные компоненты
- [Формы](./forms.md) - работа с формами
- [Модальные окна](./modals.md) - работа с модалами
