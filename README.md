# SkillSwap

Описание проекта.

## Требования

- Node.js (рекомендуется v16+)

## Установка зависимостей

```bash
npm install
```

## Запуск dev-сервера

```bash
npm run dev
```

## Production сборка и превью

```bash
npm run build
```

```bash
npm run preview
```

## Линтинг

Проверка кода на соответствие правилам:

```bash
npm run lint
```

Автоисправление проблем:

```bash
npm run lint:fix
```

## Тесты

Проект использует Jest для unit-тестов и `@testing-library/jest-dom` для DOM-матчеров.

Запустить тесты (однократный прогон):

```bash
npm run test
```

Запустить в режиме наблюдения (watch):

```bash
npm run test:watch
```

Оценить покрытие тестами:

```bash
npm run test:coverage
```

Файл инициализации тестовой среды: `src/setupTests.ts` (импортирует `@testing-library/jest-dom`).
