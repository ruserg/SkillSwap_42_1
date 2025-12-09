# Страница избранного

Документация по странице избранного (`/favorites`).

## Обзор

Страница избранного отображает список пользователей, которых текущий пользователь добавил в избранное (лайкнул). Карточки автоматически удаляются из списка при снятии лайка.

## Расположение

```
src/pages/Favorites/
├── Favorites.tsx          # Основной компонент страницы
└── favorites.module.scss  # Стили страницы
```

## Маршрут

Страница доступна по адресу `/favorites` и защищена `ProtectedRoute`:

```typescript
// src/app/Routes.tsx
<Route
  path="favorites"
  element={
    <ProtectedRoute>
      <Favorites />
    </ProtectedRoute>
  }
/>
```

## Навигация

Страница доступна через иконку сердца в шапке сайта:

```typescript
// src/widgets/Header/Header.tsx
<Link to="/favorites" className={styles.favoritesLink}>
  <DecoratedButton variant={"heart"} />
</Link>
```

## Функциональность

### Отображение карточек

- Фильтрует пользователей с `isLikedByCurrentUser === true`
- Сортирует по дате регистрации (от новых к старым) как приближение даты добавления в избранное
- Использует те же компоненты `Card`, что и на главной странице

### Удаление из избранного

- Удаление происходит через компонент `Like` в карточке
- При снятии лайка карточка автоматически исчезает из списка благодаря фильтрации
- Используется оптимистичное обновление UI

### Состояния

1. **Загрузка** - отображаются скелетоны карточек (`CardSkeleton`)
2. **Пустое состояние** - показывается сообщение "Здесь пока пусто. Добавьте карточки в избранное!"
3. **Список карточек** - отображается сетка карточек с информацией о количестве

## Использование

### Компонент

```typescript
import { Favorites } from "@pages/Favorites/Favorites";

// В Routes.tsx
<Route
  path="favorites"
  element={
    <ProtectedRoute>
      <Favorites />
    </ProtectedRoute>
  }
/>
```

### Данные

Компонент использует данные из Redux store:

```typescript
const { users, isLoading } = useAppSelector(selectUsersData);
const { cities } = useAppSelector(selectCities);
const isAuthenticated = useAppSelector(selectIsAuthenticated);
```

### Фильтрация и сортировка

```typescript
// Фильтруем только лайкнутых пользователей
const likedUsers = useMemo(() => {
  return users.filter((user) => user.isLikedByCurrentUser === true);
}, [users]);

// Сортируем по дате регистрации (от новых к старым)
const sortedLikedUsers = useMemo(() => {
  return [...likedUsers].sort(
    (a, b) =>
      new Date(b.dateOfRegistration).getTime() -
      new Date(a.dateOfRegistration).getTime(),
  );
}, [likedUsers]);
```

## Стили

Стили определены в `favorites.module.scss`:

- `.container` - контейнер страницы с максимальной шириной 1440px
- `.title` - заголовок страницы
- `.subtitle` - подзаголовок с количеством карточек
- `.cardsGrid` - сетка карточек (адаптивная, минимум 300px на карточку)
- `.emptyState` - контейнер для пустого состояния
- `.emptyText` - текст пустого состояния

## Загрузка данных

Данные загружаются автоматически при монтировании компонента:

```typescript
useEffect(() => {
  if (users.length === 0 && !isLoading) {
    dispatch(fetchUsersData());
  }
  if (cities.length === 0) {
    dispatch(fetchCities());
  }
}, [dispatch, users.length, isLoading, cities.length]);
```

## Интеграция с Like компонентом

Страница использует стандартный компонент `Card`, который содержит компонент `Like`. При снятии лайка:

1. Компонент `Like` обновляет состояние через Redux (`deleteLike` thunk)
2. Оптимистично обновляется `isLikedByCurrentUser` в store
3. Фильтр `likedUsers` автоматически исключает пользователя из списка
4. Карточка исчезает из интерфейса

## Пример использования

```typescript
// Переход на страницу избранного
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/favorites");
```

## Следующие шаги

- [Роутинг](../guides/routing.md) - настройка маршрутов
- [Auth Slice](../store/auth-slice.md) - авторизация
- [Card Component](../components/ui-components.md) - компонент карточки
- [Like Component](../components/ui-components.md) - компонент лайка
