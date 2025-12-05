# Начало работы

Руководство по установке и настройке проекта SkillSwap.

## Требования

- Node.js 18+
- npm 9+
- Git

## Установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd SkillSwap_42_1
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
VITE_API_BASE_URL=http://188.116.40.23:3001
```

Или скопируйте `.env.example`:

```bash
cp .env.example .env
```

### 4. Запуск проекта

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview
```

Проект будет доступен по адресу `http://localhost:5173`

## Структура проекта

```
src/
├── app/              # Настройка приложения
├── pages/            # Страницы
├── widgets/          # Виджеты (крупные компоненты)
├── shared/           # Переиспользуемый код
│   ├── api/         # API клиенты
│   ├── hooks/       # Хуки
│   ├── lib/         # Утилиты
│   ├── types/       # Типы
│   └── ui/          # UI компоненты
├── store/            # Redux store
├── styles/           # Глобальные стили
└── images/           # Изображения
```

## Первые шаги

### 1. Проверка подключения к API

Откройте консоль браузера и проверьте, что API доступен:

```typescript
import { api } from "@/shared/api/api";

// Health check
api.healthCheck().then(console.log);
```

### 2. Проверка Redux Store

Убедитесь, что Redux настроен правильно:

```typescript
import { useAppSelector } from "@store/hooks";
import { selectReferenceData } from "@store/slices/referenceDataSlice";

// В компоненте
const { cities } = useAppSelector(selectReferenceData);
console.log("Cities:", cities);
```

### 3. Создание первого компонента

Создайте простой компонент для проверки:

```typescript
// src/components/TestComponent.tsx
import { Button } from '@shared/ui/Button';

export const TestComponent = () => {
  return (
    <div>
      <h1>Тестовый компонент</h1>
      <Button variant="primary">Нажми меня</Button>
    </div>
  );
};
```

## Полезные команды

```bash
# Линтинг
npm run lint          # Проверка кода
npm run lint:fix      # Автоисправление

# Форматирование
npm run format        # Форматирование кода

# Тестирование
npm run test          # Запуск тестов
npm run test:watch    # Тесты в watch режиме
npm run test:coverage # Покрытие кода тестами
```

## Следующие шаги

- [Архитектура проекта](./architecture.md) - изучите структуру проекта
- [Работа с API](../api/overview.md) - начните работать с API
- [Redux Store](../store/overview.md) - изучите управление состоянием

## Решение проблем

### Проблема: API не отвечает

1. Проверьте переменную `VITE_API_BASE_URL` в `.env`
2. Убедитесь, что сервер запущен
3. Проверьте CORS настройки на сервере

### Проблема: Ошибки TypeScript

1. Убедитесь, что все зависимости установлены
2. Перезапустите TypeScript сервер в IDE
3. Проверьте `tsconfig.json`

### Проблема: Стили не применяются

1. Проверьте импорты стилей
2. Убедитесь, что используете CSS Modules правильно
3. Проверьте порядок импортов в `index.scss`
