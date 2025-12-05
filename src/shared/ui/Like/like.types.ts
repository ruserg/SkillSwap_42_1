export type ILikeProps = {
  currentLikeCount: number;
  isLiked?: boolean; // лайкнул ли текущий пользователь
  userId: number; // ID пользователя, которому ставим лайк
  isAuthenticated?: boolean; // авторизован ли пользователь
  className?: string;
  onLikeToggle?: (likeCount: number) => void;
};
