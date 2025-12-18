# Формы

Документация по работе с формами в проекте.

## Компоненты форм

### Input

Поле ввода с различными типами.

```typescript
import { Input } from '@shared/ui/Input';

<Input
  type="text"
  placeholder="Введите имя"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>
```

### Selector

Выпадающий список с поиском.

```typescript
import { Selector } from '@shared/ui/Selector';

<Selector
  options={cities}
  selected={selectedCities}
  onChange={setSelectedCities}
  placeholder="Выберите города"
  multiple
/>
```

## Примеры форм

### Форма входа

```typescript
import { useState } from 'react';
import { Input } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { useAppDispatch } from '@store/hooks';
import { login } from '@store/slices/authSlice';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <Button type="submit" variant="primary">
        Войти
      </Button>
    </form>
  );
};
```

### Форма регистрации

```typescript
import { useState } from 'react';
import { Input } from '@shared/ui/Input';
import { Button } from '@shared/ui/Button';
import { useAppDispatch } from '@store/hooks';
import { register } from '@store/slices/authSlice';

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(register(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Имя"
        required
      />
      <Input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required
      />
      <Button type="submit" variant="primary">
        Зарегистрироваться
      </Button>
    </form>
  );
};
```

## Валидация

### Простая валидация

```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validate = () => {
  const newErrors: Record<string, string> = {};

  if (!email || !email.includes("@")) {
    newErrors.email = "Неверный email";
  }

  if (!password || password.length < 6) {
    newErrors.password = "Пароль должен быть не менее 6 символов";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Использование Zod

Проект использует Zod для валидации. Схемы находятся в `src/shared/lib/zod/schemas/`.

```typescript
import { loginSchema } from "@/shared/lib/zod/schemas";

const result = loginSchema.safeParse({ email, password });
if (!result.success) {
  // Обработка ошибок валидации
}
```

## Обработка ошибок

```typescript
const { error } = useAppSelector(selectAuth);

return (
  <form>
    {error && <div className="error">{error}</div>}
    {/* Поля формы */}
  </form>
);
```

## Следующие шаги

- [UI Компоненты](./ui-components.md) - доступные компоненты
- [Валидация](../guides/forms.md) - детали валидации
