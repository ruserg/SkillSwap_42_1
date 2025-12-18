# Виджет OfferPreview

Виджет предпросмотра предложения (навыка).

## Обзор

Виджет `OfferPreview` (`src/widgets/OfferPreview/OfferPreview.tsx`) отображает детальную информацию о предложении в модальном окне.

## Импорт

```typescript
import { OfferPreview } from "@widgets/OfferPreview/OfferPreview";
```

## Пропсы

```typescript
interface OfferPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  skill: TSkill;
  user: TUser;
}
```

## Функциональность

- Модальное окно с детальной информацией
- Изображения навыка (карусель)
- Информация о пользователе
- Описание навыка
- Кнопка лайка
- Кнопка закрытия

## Использование

```typescript
import { useState } from 'react';
import { OfferPreview } from '@widgets/OfferPreview/OfferPreview';

export const SkillsList = () => {
  const [selectedOffer, setSelectedOffer] = useState<{ skill: TSkill; user: TUser } | null>(null);

  return (
    <>
      {/* Список навыков */}
      {skills.map(skill => (
        <button onClick={() => setSelectedOffer({ skill, user })}>
          Показать детали
        </button>
      ))}

      {/* Модальное окно */}
      {selectedOffer && (
        <OfferPreview
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
          skill={selectedOffer.skill}
          user={selectedOffer.user}
        />
      )}
    </>
  );
};
```

## Стилизация

Стили находятся в:

- `offerPreview.module.scss` - стили компонента
- `offerPreviewModal.module.scss` - стили модального окна

## Следующие шаги

- [Modal](../components/ui-components.md#modal) - компонент модального окна
- [ImagesCarousel](./images-carousel.md) - карусель изображений
