# Типы авторизации

Документация по типам, используемым для авторизации.

## Основные типы

### RegisterRequest

Запрос на регистрацию.

```typescript
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  avatar: File; // обязательный файл аватара
  firstName?: string; // имя (из step2)
  lastName?: string; // фамилия (из step2)
  dateOfBirth?: string; // дата рождения в формате ISO (из step2)
  gender?: "M" | "F"; // пол (из step2)
  cityId?: number; // ID города (из step2)
}
```

**Важно:**

- `avatar` - обязательное поле
- Все данные отправляются через `multipart/form-data`

**Использование:**

```typescript
const formData = new FormData();
formData.append("email", "user@example.com");
formData.append("password", "password123");
formData.append("name", "Иван Иванов");
formData.append("avatar", avatarFile); // File объект
formData.append("firstName", "Иван");
formData.append("lastName", "Иванов");
formData.append("dateOfBirth", "1990-01-01");
formData.append("gender", "M");
formData.append("cityId", "1");

await api.register(formData);
```

### LoginRequest

Запрос на вход.

```typescript
export interface LoginRequest {
  email: string;
  password: string;
}
```

**Использование:**

```typescript
await api.login({
  email: "user@example.com",
  password: "password123",
});
```

### AuthResponse

Ответ при регистрации или входе.

```typescript
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

**Использование:**

```typescript
const response: AuthResponse = await api.login(credentials);
// response.user - данные пользователя
// response.accessToken - токен доступа
// response.refreshToken - токен обновления
```

### User

Упрощенный тип пользователя для авторизации.

```typescript
export interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl: string; // URL загруженного аватара
  dateOfRegistration: string;
  lastLoginDatetime: string;
}
```

**Отличия от TUser:**

- Меньше полей (только необходимые для авторизации)
- Даты как строки (не Date объекты)
- Включает `avatarUrl` - URL загруженного аватара

### RefreshTokenRequest

Запрос на обновление токена.

```typescript
export interface RefreshTokenRequest {
  refreshToken: string;
}
```

**Использование:**

```typescript
await api.refreshToken({
  refreshToken: localStorage.getItem("refreshToken"),
});
```

### RefreshTokenResponse

Ответ при обновлении токена.

```typescript
export interface RefreshTokenResponse {
  accessToken: string;
}
```

**Использование:**

```typescript
const response = await api.refreshToken({ refreshToken });
// response.accessToken - новый токен доступа
```

## Использование в компонентах

### Форма регистрации

```typescript
import type { RegisterRequest } from "@shared/lib/types/api";

const [formData, setFormData] = useState<RegisterRequest>({
  email: "",
  password: "",
  name: "",
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await dispatch(register(formData));
};
```

### Форма входа

```typescript
import type { LoginRequest } from "@shared/lib/types/api";

const [credentials, setCredentials] = useState<LoginRequest>({
  email: "",
  password: "",
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await dispatch(login(credentials));
};
```

## Валидация

Рекомендуется использовать валидацию перед отправкой:

```typescript
const validateRegister = (data: RegisterRequest): string | null => {
  if (!data.email || !data.email.includes("@")) {
    return "Неверный email";
  }
  if (!data.password || data.password.length < 6) {
    return "Пароль должен быть не менее 6 символов";
  }
  if (!data.name || data.name.length < 2) {
    return "Имя должно быть не менее 2 символов";
  }
  return null;
};
```

## Следующие шаги

- [Авторизация API](../api/authentication.md) - работа с авторизацией
- [Auth Slice](../store/auth-slice.md) - использование в Redux
- [Основные типы](./main-types.md) - другие типы проекта
