# Типы API

Все типы для API запросов находятся в `src/shared/lib/types/api.ts`.

## Авторизация

### RegisterRequest

```typescript
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  avatar?: File; // файл аватара (опционально)
  dateOfBirth?: string; // дата рождения в формате ISO (из step2)
  gender?: "M" | "F"; // пол (из step2)
  cityId?: number; // ID города (из step2)
  desiredCategories?: number[]; // желаемые категории (из step2)
}
```

**Важно:**

- `avatar` - обязательное поле
- Все данные отправляются через `multipart/form-data`

### LoginRequest

```typescript
export interface LoginRequest {
  email: string;
  password: string;
}
```

### AuthResponse

```typescript
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

Где `User` - это:

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl: string; // URL загруженного аватара
  dateOfRegistration: string;
  lastLoginDatetime: string;
}
```

### RefreshTokenRequest

```typescript
export interface RefreshTokenRequest {
  refreshToken: string;
}
```

### RefreshTokenResponse

```typescript
export interface RefreshTokenResponse {
  accessToken: string;
}
```

## Использование

```typescript
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from "@shared/lib/types/api";

const registerData: RegisterRequest = {
  email: "user@example.com",
  password: "SecurePass123!",
  name: "Иван Иванов",
  avatar: avatarFile, // File объект (опционально)
  dateOfBirth: "1990-01-01",
  gender: "M",
  cityId: 1,
  desiredCategories: [1, 2, 3],
};

const loginData: LoginRequest = {
  email: "user@example.com",
  password: "SecurePass123!",
};
```
