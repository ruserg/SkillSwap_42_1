import type { TCity } from "@entities/city/types";
import type { UserWithLikes } from "@entities/user/types";

export type CardProps = {
  user: UserWithLikes;
  cities: TCity[];
  isAuthenticated?: boolean;
  onDetailsClick?: (user: UserWithLikes) => void;
  onExchangeClick?: (user: UserWithLikes) => void;
  className?: string;
  isLoading?: boolean;
};
