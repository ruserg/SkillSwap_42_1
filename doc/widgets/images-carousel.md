# Виджет ImagesCarousel

Карусель изображений для навыков.

## Обзор

Виджет `ImagesCarousel` (`src/widgets/ImagesCarousel/ImagesCarousel.tsx`) отображает изображения навыка в виде карусели.

## Импорт

```typescript
import { ImagesCarousel } from "@widgets/ImagesCarousel/ImagesCarousel";
```

## Пропсы

```typescript
interface ImagesCarouselProps {
  images: string[];
  alt?: string;
}
```

## Функциональность

- Показ изображений в карусели
- Навигация между изображениями
- Индикаторы текущего изображения
- Автоматическая прокрутка (опционально)

## Использование

```typescript
import { ImagesCarousel } from '@widgets/ImagesCarousel/ImagesCarousel';

export const SkillCard = ({ skill }: { skill: TSkill }) => {
  return (
    <div>
      <ImagesCarousel images={skill.images} alt={skill.name} />
      <h3>{skill.name}</h3>
    </div>
  );
};
```

## Стилизация

Стили находятся в `imagesCarousel.module.scss`.

## Следующие шаги

- [OfferPreview](./offer-preview.md) - использование в предпросмотре
- [Card](../components/ui-components.md#card) - использование в карточках
