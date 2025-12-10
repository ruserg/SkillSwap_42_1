type TOfferVariant = "userProfileOffer" | "modalOffer";

export type TOfferProps = {
  variant?: "modalOffer" | "userProfileOffer";
  skillName?: string;
  categoryName?: string;
  subcategoryName?: string;
  description?: string;
  images?: string[];
  onEdit?: () => void;
  onConfirm?: () => void;
  onExchange?: () => void;
  isEditable?: boolean;
  isExchangeProposed?: boolean; // Добавляем новый пропс
};
