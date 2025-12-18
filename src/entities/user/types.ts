// Пользователи
export type TUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  likes: number; // устаревшее поле, используйте likesCount
  likesCount: number; // количество лайков пользователя
  isLikedByCurrentUser: boolean; // лайкнул ли текущий пользователь этого пользователя
  cityId: number;
  dateOfBirth: Date; // дата рождения пользователя
  gender: Gender; // пол пользователя
  dateOfRegistration: Date; // дата регистрации пользователя на платформе
  lastLoginDatetime: Date; // дата и время последнего входа пользователя
  images?: string[]; // опциональный массив URL-адресов дополнительных изображений пользователя
  about?: string; // текст "О себе"
};

// Пол пользователя (для компактности хранения)
export type Gender = "M" | "F";

// Пользователь с информацией о лайках
export type UserWithLikes = TUser & {
  likesCount?: number; // общее количество лайков (опционально, если еще не загружено)
  isLikedByCurrentUser?: boolean; // лайкнул ли текущий пользователь (опционально, если пользователь не авторизован)
};

// Пользователь для авторизации (возвращается в AuthResponse)
export interface User {
  id: number;
  email: string;
  name: string;
  dateOfBirth: string;
  gender: "M" | "F";
  cityId: number;
  avatarUrl: string; // URL загруженного аватара
  about: string; // текст "О себе"
  dateOfRegistration: string;
  lastLoginDatetime: string;
}
