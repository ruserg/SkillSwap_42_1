type TOfferVariant = "userProfileOffer" | "modalOffer";

export type TOfferProps = {
  variant?: TOfferVariant;

  skillName?: string;
  categoryName?: string;
  subcategoryName?: string;
  description?: string;
  images?: string[];
  onEdit?: () => void;
  onConfirm?: () => void;
  onExchange?: () => void;
  isEditable?: boolean;
};
