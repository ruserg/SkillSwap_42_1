# Документация для фронтенда

Общая документация по фронтенд-части проекта SkillSwap.

## Быстрый старт

Для начала работы с фронтендом:

1. **Установка зависимостей:**

   ```bash
   npm install
   ```

2. **Настройка переменных окружения:**
   Создайте файл `.env` в корне проекта:

   ```env
   VITE_API_BASE_URL=http://188.116.40.23:3001
   ```

3. **Запуск проекта:**
   ```bash
   npm run dev
   ```

## Структура проекта

Проект использует архитектуру **Feature-Sliced Design (FSD)**:

```
src/
├── app/                        # Инициализация приложения
│   ├── store/                  # Redux store
│   ├── Routes.tsx              # Маршруты
│   ├── App.tsx                 # Корневой компонент (централизованная проверка авторизации)
│   └── ProtectedRoute.tsx      # Защита маршрутов
├── pages/                      # Страницы
│   ├── MainPage/
│   ├── Login/
│   ├── Favorites/              # Страница избранного
│   ├── ErrorPage/
│   └── signup/
├── widgets/                    # Сложные UI компоненты
│   ├── Header/
│   ├── Footer/
│   ├── UserCardsSection/
│   └── Toast/                  # Тосты-уведомления
├── features/                   # Бизнес-логика
│   ├── auth/                   # Авторизация
│   ├── signup/                 # Регистрация
│   ├── filter-users/           # Фильтрация пользователей
│   └── notifications/          # Уведомления
├── entities/                   # Бизнес-сущности
│   ├── user/
│   ├── skill/
│   ├── category/
│   ├── city/
│   ├── like/
│   └── notification/           # Уведомления
└── shared/                     # Переиспользуемый код
    ├── api/                    # API клиенты
    ├── lib/                    # Утилиты и типы
    └── ui/                     # UI компоненты
```

## Основные технологии

- **React 19** - UI библиотека
- **Redux Toolkit** - управление состоянием
- **TypeScript** - типизация
- **Vite** - сборщик
- **SCSS** - стилизация
- **React Router** - маршрутизация

## Работа с API

Вся документация по работе с API находится в разделе [API](../api/):

- [Обзор API](../api/overview.md) - общая информация об API
- [Интеграция с React и Redux](../api/react-integration.md) - примеры использования API в React
- [Авторизация](../api/authentication.md) - работа с авторизацией
- [Эндпоинты](../api/endpoints.md) - все доступные эндпоинты
- [Обработка ошибок](../api/errors.md) - обработка ошибок API

## Redux Store

Документация по Redux store:

- [Обзор Store](../store/overview.md) - структура Redux store
- [Auth Slice](../store/auth-slice.md) - управление авторизацией
- [Users Data Slice](../store/users-data-slice.md) - данные пользователей
- [Skills Data Slice](../store/skills-data-slice.md) - навыки
- [Likes Slice](../store/likes-slice.md) - лайки
- [Category Data Slice](../store/category-data-slice.md) - категории
- [City Data Slice](../store/city-data-slice.md) - города
- [Notifications Slice](../store/notifications-slice.md) - уведомления

## Компоненты

- [UI Компоненты](../components/ui-components.md) - переиспользуемые UI компоненты
- [Формы](../components/forms.md) - компоненты форм
- [Модальные окна](../components/modals.md) - работа с модальными окнами

## Виджеты

- [Filter](../widgets/filter.md) - виджет фильтрации
- [UserCardsSection](../widgets/user-cards-section.md) - секция карточек пользователей
- [Header и Footer](../widgets/header-footer.md) - шапка и подвал сайта
- [Toast](../widgets/toast.md) - тост-уведомления

## Гайды

- [Архитектура проекта](../guides/architecture.md) - Feature-Sliced Design
- [Роутинг](../guides/routing.md) - настройка маршрутов
- [Работа с формами](../guides/forms.md) - создание и валидация форм

## Типы

- [Основные типы](../types/main-types.md) - пользователи, навыки, лайки
- [Типы авторизации](../types/auth-types.md) - типы для авторизации
- [Типы API](../types/api-types.md) - типы для API запросов
- [Типы фильтров](../types/filter-types.md) - типы для фильтрации

## Важные замечания

1. **Типы API**: Все типы API находятся в `src/shared/lib/types/api.ts`
2. **Типы сущностей**: Типы находятся в соответствующих entities (например, `src/entities/user/types.ts`)
3. **Переменные окружения**: Обязательно настройте `VITE_API_BASE_URL` в `.env`
4. **Структура проекта**: Проект использует Feature-Sliced Design (FSD) архитектуру

## Следующие шаги

- [Интеграция API с React](../api/react-integration.md) - начните отсюда для работы с API
- [Архитектура проекта](../guides/architecture.md) - изучите структуру проекта
- [Redux Store](../store/overview.md) - работа с состоянием
