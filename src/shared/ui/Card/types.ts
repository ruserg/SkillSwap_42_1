import type { TCity } from "@entities/city/types";
import type { UserWithLikes } from "@entities/user/types";

export type CardVariant = "default" | "profile" | "compact";

export type CardProps = {
  user: UserWithLikes;
  cities: TCity[];
  onDetailsClick?: (user?: UserWithLikes) => void;
  onDeleteClick?: (user?: UserWithLikes) => void;
  onAcceptClick?: (user?: UserWithLikes) => void;
  onRejectClick?: (user?: UserWithLikes) => void;
  onCancelClick?: (user?: UserWithLikes) => void;
  onExchangeClick?: (user: UserWithLikes) => void;
  className?: string;
  isLoading?: boolean;
  variant?: CardVariant;
  description?: string; // Описание для variant="profile"
  buttonText?: string;
  buttonDeleteText?: string;
  buttonAcceptText?: string;
  buttonRejectText?: string;
  buttonCancelText?: string;
};
