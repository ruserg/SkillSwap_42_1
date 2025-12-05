# CSS Modules

Документация по работе с CSS Modules.

## Использование

Каждый компонент имеет свой файл стилей:

```typescript
import styles from './component.module.scss';

<div className={styles.container}>
  <h1 className={styles.title}>Заголовок</h1>
</div>
```

## Именование

Используйте BEM-подобное именование:

```scss
.container {
  &__header {
    // .container__header
  }

  &_active {
    // .container_active
  }
}
```

## Динамические классы

```typescript
import clsx from 'clsx';

<div className={clsx(
  styles.container,
  isActive && styles.container_active,
  className
)}>
```

## Глобальные переменные

Доступны через автоматический импорт:

```scss
.my-component {
  color: var(--color-primary);
  padding: calc(var(--spacing-unit) * 2);
}
```
