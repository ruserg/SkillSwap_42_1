// Типы для API авторизации
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  avatar: File; // файл аватара
  firstName?: string; // имя (из step2)
  lastName?: string; // фамилия (из step2)
  dateOfBirth?: string; // дата рождения в формате ISO (из step2)
  gender?: "M" | "F"; // пол (из step2)
  cityId?: number; // ID города (из step2)
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: import("@entities/user/types").User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string; // Опционально, если сервер использует rotation refresh tokens
}
