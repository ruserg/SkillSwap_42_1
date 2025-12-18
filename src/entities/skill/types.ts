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

// Типы предложений для навыков
export type TypeOfProposal = "offer" | "request";
