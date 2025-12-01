import type { TCity, TUser } from "@/shared/types/types";

export type CardProps = {
  user: TUser;
  cities: TCity[];
  onDetailsClick?: (user: TUser) => void;
  onExchangeClick?: (user: TUser) => void;
  className?: string;
  isLoading?: boolean;
};
