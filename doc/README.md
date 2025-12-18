# Документация проекта SkillSwap

Добро пожаловать в документацию проекта SkillSwap! Здесь вы найдете всю необходимую информацию для работы с проектом.

## Структура документации

### Быстрый старт

- [Начало работы](./guides/getting-started.md) - установка и настройка проекта
- [Архитектура проекта](./guides/architecture.md) - обзор структуры проекта

### API

- [Обзор API](./api/overview.md) - общая информация об API
- [Интеграция с React и Redux](./api/react-integration.md) - примеры использования API в React
- [Авторизация](./api/authentication.md) - работа с авторизацией
- [Эндпоинты](./api/endpoints.md) - все доступные эндпоинты
- [Обработка ошибок](./api/errors.md) - обработка ошибок API

### Компоненты

- [UI Компоненты](./components/ui-components.md) - переиспользуемые UI компоненты
- [Полный справочник UI компонентов](./shared/ui-components-reference.md) - детальная документация с обоснованиями
- [Формы](./components/forms.md) - компоненты форм
- [Модальные окна](./components/modals.md) - работа с модальными окнами

### Виджеты

- [Filter](./widgets/filter.md) - виджет фильтрации
- [UserCardsSection](./widgets/user-cards-section.md) - секция карточек пользователей
- [Header и Footer](./widgets/header-footer.md) - шапка и подвал сайта
- [OfferPreview](./widgets/offer-preview.md) - предпросмотр предложений
- [Toast](./widgets/toast.md) - тост-уведомления
- [ImagesCarousel](./widgets/images-carousel.md) - карусель изображений

### Страницы

- [Главная страница](./pages/main-page.md) - главная страница с фильтрами
- [Favorites](./pages/favorites.md) - страница избранного

### Хуки

- [useFilteredUsers](./hooks/use-filtered-users.md) - фильтрация пользователей

### Redux Store

- [Обзор Store](./store/overview.md) - структура Redux store
- [Auth Slice](./store/auth-slice.md) - управление авторизацией
- [Users Data Slice](./store/users-data-slice.md) - данные пользователей
- [Skills Data Slice](./store/skills-data-slice.md) - навыки
- [Notifications Slice](./store/notifications-slice.md) - уведомления
- [Reference Data Slice](./store/reference-data-slice.md) - справочные данные

### Типы

- [Основные типы](./types/main-types.md) - пользователи, навыки, лайки
- [Типы авторизации](./types/auth-types.md) - типы для авторизации
- [Типы API](./types/api-types.md) - типы для API запросов
- [Типы фильтров](./types/filter-types.md) - типы для фильтрации

### Стили

- [Структура стилей](./styles/structure.md) - организация стилей
- [CSS Modules](./styles/css-modules.md) - работа с CSS Modules
- [Темы](./styles/themes.md) - светлая и темная темы
- [Переменные](./styles/variables.md) - CSS переменные

### Гайды

- [Архитектура проекта](./guides/architecture.md) - Feature-Sliced Design
- [Стандарты кода](./guides/code-style.md) - конвенции именования и структуры
- [Создание компонентов](./guides/component-creation.md) - как создать новый компонент
- [Роутинг](./guides/routing.md) - настройка маршрутов
- [Работа с формами](./guides/forms.md) - создание и валидация форм
- [Тестирование](./guides/testing.md) - написание тестов
- [Развертывание](./guides/deployment.md) - деплой приложения

## Быстрый поиск

### Как начать работу?

→ [Начало работы](./guides/getting-started.md)

### Как работать с API?

→ [Обзор API](./api/overview.md)

### Как использовать компоненты?

→ [UI Компоненты](./components/ui-components.md)

### Как создать новый компонент?

→ [Создание компонентов](./guides/component-creation.md)

### Как настроить Redux?

→ [Обзор Store](./store/overview.md)

### Какие стандарты кода?

→ [Стандарты кода](./guides/code-style.md)

## Основные технологии

- **React 19** - UI библиотека
- **Redux Toolkit** - управление состоянием
- **TypeScript** - типизация
- **Vite** - сборщик
- **SCSS** - стилизация
- **React Router** - маршрутизация

## Принципы документации

Все документы в проекте следуют единой структуре:

1. **Обоснование решения** - почему сделано так, а не иначе
2. **API/Интерфейс** - как использовать
3. **Примеры** - практические примеры
4. **Особенности** - важные детали реализации
5. **Связанные компоненты** - ссылки на родственную документацию

**Почему это важно:**

- Понимание причин помогает принимать правильные решения
- Примеры ускоряют разработку
- Обоснования предотвращают повторение ошибок

## Планы и статус документации

- [План проверки и дополнения документации](./PLANS.md) - чек-листы проверки и планы новых статей
- [Статус документации](./DOCUMENTATION_STATUS.md) - текущий статус и выполненные работы

## Вклад в проект

При добавлении нового функционала:

1. Обновите соответствующую документацию
2. Добавьте примеры использования
3. Обновите этот README при необходимости
4. Следуйте стандартной структуре документов

## Контакты

Если у вас есть вопросы по документации, создайте issue в репозитории проекта.
