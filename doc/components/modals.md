# Модальные окна

Документация по работе с модальными окнами.

## Компонент Modal

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
  <p>Содержимое</p>
</Modal>
```

## ModalOverlay

Компонент затемнения фона.

```typescript
import { ModalOverlay } from '@shared/ui/ModalOverlay';

<ModalOverlay isOpen={isOpen} onClick={onClose} />
```

## Примеры использования

### Простое модальное окно

```typescript
const [isOpen, setIsOpen] = useState(false);

<>
  <button onClick={() => setIsOpen(true)}>Открыть</button>
  <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
    <h2>Заголовок</h2>
    <p>Содержимое модального окна</p>
  </Modal>
</>
```

### Модальное окно с формой

```typescript
<Modal isOpen={isOpen} onClose={onClose} title="Редактирование">
  <form onSubmit={handleSubmit}>
    {/* Поля формы */}
  </form>
</Modal>
```
