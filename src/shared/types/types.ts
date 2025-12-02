// Пользователи
export type TUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  likes: number;
  cityId: number;
  dateOfBirth: Date; // дата рождения пользователя
  gender: Gender; // пол пользователя
  dateOfRegistration: Date; // дата регистрации пользователя на платформе
  lastLoginDatetime: Date; // дата и время последнего входа пользователя
  images?: string[]; // опциональный массив URL-адресов дополнительных изображений пользователя
};

// Категории навыков
export type TCategory = {
  id: number; // уникальный идентификатор категории
  name: string; // название категории (например, «Музыка»)
};

// Подкатегории навыков
export type TSubcategory = {
  id: number; // уникальный идентификатор подкатегории
  categoryId: number; // ID категории
  name: string; // название подкатегории (например, «Гитара»)
};

// Типы предложений для навыков
export type TypeOfProposal = "учу" | "учусь";

// Навыки
export type TSkill = {
  id: number; // уникальный идентификатор навыка
  subcategoryId: number; // ID подкатегории
  userId: number; // ID пользователя-владельца навыка
  name: string; // название навыка (например, «Игра на гитаре»)
  description: string; // описание навыка
  type_of_proposal: TypeOfProposal; // тип предложения
  images: string[]; // массив URL-адресов изображений навыка
  modified_datetime: Date; // дата последнего изменения навыка
};

// Города
export type TCity = {
  id: number; // уникальный идентификатор города
  name: string; // название города (например, «Москва»)
};

// Пол пользователя (для компактности хранения)
export type Gender = "M" | "F";

// Лайки (ПОКА НЕАКТУАЛЬНО)
// export type TLike = {
//   id: number; //уникальный идентификатор лайка
//   userId: number; //ID пользователя, который поставил лайк
//   skillId: number; //ID навыка, который лайкнули
// };

// Пользователь с количеством лайков
export type UserWithLikes = TUser & { likesCount: number };
