// Информация о лайках пользователя (публичная)
export type TUserLikesInfo = {
  userId: number; // ID пользователя
  likesCount: number; // общее количество лайков
  isLikedByCurrentUser: boolean; // лайкнул ли текущий пользователь этого пользователя
};
