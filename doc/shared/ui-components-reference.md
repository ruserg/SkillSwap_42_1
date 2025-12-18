# Полный справочник UI компонентов

Полный справочник всех переиспользуемых UI компонентов проекта SkillSwap с обоснованием решений.

## Обоснование решения

**Почему компоненты находятся в `shared/ui/`:**

- `shared` - слой переиспользуемого кода без бизнес-логики
- `ui` - UI компоненты должны быть независимы от бизнес-логики
- Компоненты могут использоваться в разных частях приложения (pages, widgets, features)

**Почему каждый компонент в отдельной папке:**

- Удобно хранить связанные файлы (компонент, стили, типы) вместе
- Упрощает импорты и навигацию по проекту
- Соответствует принципам модульности

**Почему используется наследование от React HTMLAttributes:**

- Типобезопасность - все стандартные HTML атрибуты доступны автоматически
- Не нужно дублировать стандартные пропсы (disabled, className, onClick и т.д.)
- Соответствует best practices TypeScript и React
- Улучшает DX (developer experience) - автодополнение в IDE работает лучше

## Компоненты навигации и взаимодействия

### Button

Универсальная кнопка с поддержкой различных вариантов стилизации и навигации.

**Обоснование решения:**

**Почему единый компонент Button вместо отдельных компонентов:**

- Один компонент проще поддерживать
- Единый стиль и поведение во всем приложении
- Меньше дублирования кода

**Почему поддержка Link через проп `to`:**

- Универсальность - один компонент для кнопок и ссылок
- TypeScript discriminated unions обеспечивают типобезопасность
- Удобно использовать без дополнительных оберток

**Почему варианты через проп `variant`:**

- Один компонент с разными стилями проще поддерживать
- Легко добавлять новые варианты
- Соответствует паттерну Variant в дизайн-системах

```typescript
import { Button } from "@shared/ui/Button/Button";

// Кнопка
<Button variant="primary" onClick={handleClick}>
  Нажми меня
</Button>

// Кнопка-ссылка
<Button to="/profile" variant="secondary">
  Профиль
</Button>
```

[Полная документация](./components/ui-components.md#button)

### DecoratedButton

Кнопка с иконкой для декоративных действий (лайки, уведомления, тема).

**Обоснование решения:**

**Почему отдельный компонент, а не вариант Button:**

- Специфичное поведение (иконки, счетчики уведомлений)
- Разные требования к accessibility (aria-labels)
- Упрощает использование - не нужно передавать иконки через props

**Почему наследование от ButtonHTMLAttributes:**

- Все стандартные атрибуты кнопки доступны (disabled, type, aria-\*)
- Не нужно дублировать пропсы
- Типобезопасность

```typescript
import { DecoratedButton } from "@shared/ui/DecoratedButton/DecoratedButton";

<DecoratedButton variant="heart" onClick={handleLike} />
<DecoratedButton variant="bell" notificationsCount={5} />
```

### Arrow

Стрелка для индикации состояния (открыто/закрыто).

**Обоснование решения:**

**Почему просто span, а не button:**

- Часто используется внутри других интерактивных элементов (кнопок, ссылок)
- HTML не позволяет вложенные button элементы
- Визуальный индикатор, а не интерактивный элемент

**Почему наследование от HTMLAttributes:**

- Можно передавать любые HTML атрибуты (className, aria-_, data-_)
- Гибкость использования

```typescript
import { Arrow } from "@shared/ui/Arrow/Arrow";

<button onClick={toggle}>
  Меню
  <Arrow isOpen={isOpen} />
</button>
```

## Компоненты форм

### Input

Универсальное поле ввода с поддержкой различных типов.

**Обоснование решения:**

**Почему один компонент для всех типов input:**

- Единый стиль и поведение
- Упрощает поддержку
- Переиспользование кода

**Почему наследование от InputHTMLAttributes:**

- Все стандартные атрибуты доступны (placeholder, value, disabled, name, checked и т.д.)
- Не нужно дублировать пропсы
- Соответствие стандартам HTML

**Почему специальные пропсы (isOpenList, isShowPassword):**

- Бизнес-логика, специфичная для приложения
- Кастомизация поведения для разных типов input

```typescript
import { Input } from "@shared/ui/Input/Input";

<Input type="text" placeholder="Введите имя" value={name} onChange={handleChange} />
<Input type="password" isShowPassword />
<Input type="checkbox" checked={isChecked} onChange={handleCheck} />
```

[Полная документация](./components/ui-components.md#input)

### FormField

Композитный компонент для полей формы с лейблом и обработкой ошибок.

**Обоснование решения:**

**Почему отдельный компонент:**

- Инкапсулирует типичный паттерн (label + input + error)
- Уменьшает дублирование кода
- Единообразие форм

**Почему наследование от InputHTMLAttributes:**

- Все атрибуты input доступны
- Гибкость использования

```typescript
import { FormField } from "@shared/ui/FormField/FormField";

<FormField
  label="Email"
  id="email"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
/>
```

### Selector

Селектор с выпадающим списком для выбора опций (radio/checkbox группы).

**Обоснование решения:**

**Почему кастомный компонент вместо нативного select:**

- Нужна поддержка множественного выбора с чекбоксами
- Кастомизация дизайна
- Лучший UX с поиском

```typescript
import { Selector } from "@shared/ui/Selector/Selector";

<Selector
  id="category"
  isOpen={isOpen}
  onToggle={handleToggle}
  selectionTitle="Категория"
  selectionPlaceholder="Выберите категорию"
  selectionOptions={options}
  selectorType="checkbox"
  enableSearch
/>
```

## Компоненты отображения данных

### Card

Карточка пользователя с информацией и навыками.

**Обоснование решения:**

**Почему компонент в shared/ui, а не в widgets:**

- Переиспользуется в разных местах (главная страница, избранное, похожие пользователи)
- Не содержит сложной бизнес-логики
- Является презентационным компонентом

**Почему автоматическая загрузка навыков:**

- Упрощает использование - не нужно загружать навыки отдельно
- Инкапсулирует логику получения данных
- Но усложняет компонент - возможно, стоило вынести в feature

```typescript
import { Card } from "@shared/ui/Card/Card";

<Card
  user={user}
  cities={cities}
  onDetailsClick={(user) => navigate(`/user/${user.id}`)}
/>
```

[Полная документация](./components/ui-components.md#card)

### CardSkeleton

Скелетон для карточки пользователя во время загрузки.

**Обоснование решения:**

**Почему отдельный компонент:**

- Инкапсулирует структуру скелетона
- Легко поддерживать синхронизацию с Card
- Переиспользование

```typescript
import { CardSkeleton } from "@shared/ui/CardSkeleton/CardSkeleton";

{isLoading ? <CardSkeleton /> : <Card user={user} />}
```

## Компоненты обратной связи

### ErrorMessage

Сообщение об ошибке для форм.

**Обоснование решения:**

**Почему наследование от HTMLAttributes:**

- Можно добавлять aria-атрибуты для accessibility
- Гибкость стилизации через className
- Стандартное поведение

```typescript
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";

<ErrorMessage className={styles.error}>
  Поле обязательно для заполнения
</ErrorMessage>
```

### SuccessMessage

Сообщение об успешном действии.

**Обоснование решения:**

**Почему поддержка children:**

- Гибкость - можно передать кастомный контент
- Обратная совместимость сохранена
- Универсальность

```typescript
import { SuccessMessage } from "@shared/ui/SuccessMessage/SuccessMessage";

<SuccessMessage variant="successMessage" />
```

### Loader

Индикатор загрузки.

**Обоснование решения:**

**Почему наследование от HTMLAttributes:**

- Можно передавать aria-live, aria-busy для accessibility
- Гибкость использования

```typescript
import { Loader } from "@shared/ui/Loader/Loader";

<Loader size={80} />
```

## Компоненты навигации

### Logo

Логотип приложения со ссылкой на главную.

**Обоснование решения:**

**Почему компонент, а не просто img:**

- Инкапсулирует ссылку на главную
- Единое место для изменения логотипа
- Стилизация

```typescript
import { Logo } from "@shared/ui/Logo/Logo";

<Logo />
```

## Компоненты специального назначения

### Calendar

Календарь для выбора даты (обертка над react-datepicker).

**Обоснование решения:**

**Почему обертка над внешней библиотекой:**

- Единый API во всем приложении
- Кастомизация стилей внешней библиотеки
- Инкапсуляция сложности

**Почему Calendar.scss (не модуль):**

- Нужно переопределять стили внешней библиотеки
- Глобальные классы библиотеки требуют глобальных стилей
- Это исключение из правила использования модулей

```typescript
import { Calendar } from "@shared/ui/Calendar/Calendar";

const [date, setDate] = useState<Date | null>(null);

<Calendar value={date} onChange={setDate} placeholder="Выберите дату" />
```

### Modal

Модальное окно.

**Обоснование решения:**

**Почему кастомный компонент:**

- Полный контроль над поведением
- Интеграция с дизайн-системой
- Accessibility (focus trap, ESC закрытие)

**Почему Portal:**

- Модалка должна рендериться вне DOM-иерархии родителя
- Предотвращает проблемы с z-index и overflow
- Стандартная практика для модалок

```typescript
import { Modal } from "@shared/ui/Modal/Modal";

<Modal isOpen={isOpen} onClose={handleClose} titleId="modal-title">
  <p>Содержимое модального окна</p>
</Modal>
```

[Полная документация](./components/modals.md)

## Компоненты-обертки

### WelcomeSection

Секция приветствия с изображением и текстом.

**Обоснование решения:**

**Почему поддержка children:**

- Гибкость - можно передать кастомный контент
- Обратная совместимость сохранена
- Универсальность использования

```typescript
import { WelcomeSection } from "@shared/ui/WelcomeSection/WelcomeSection";

<WelcomeSection
  src={lightBulb}
  alt="Лампочка"
  title="Добро пожаловать!"
  description="Описание"
/>
```

### CardsSection

Секция с карточками и заголовком.

**Обоснование решения:**

**Почему отдельный компонент:**

- Типичный паттерн повторяется
- Инкапсулирует логику "Смотреть все"
- Единообразие секций

**Почему children:**

- Гибкость - можно передать любые карточки
- Переиспользование

```typescript
import { CardsSection } from "@shared/ui/CardsSection/CardsSection";

<CardsSection
  title="Популярные пользователи"
  showViewAll
  viewAllProps={viewAllProps}
>
  {cards.map(card => <Card key={card.id} {...card} />)}
</CardsSection>
```

## См. также

- [UI Компоненты](./components/ui-components.md) - базовая документация
- [Архитектура проекта](./guides/architecture.md)
- [Стандарты кода](./guides/code-style.md)
