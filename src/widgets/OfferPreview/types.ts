type TOfferVariant = "userProfileOffer" | "modalOffer";

export type TOfferProps = {
  variant?: "modalOffer" | "userProfileOffer" | "mySkills";
  skillName?: string;
  categoryName?: string;
  subcategoryName?: string;
  description?: string;
  images?: string[];
  onEdit?: () => void;
  onConfirm?: () => void;
  onExchange?: () => void;
  isEditable?: boolean;
  isExchangeProposed?: boolean;
  exchangeStatus?:
    | "pending"
    | "accepted"
    | "rejected"
    | "completed"
    | "cancelled";

  currentUserId?: string;
  ownerId?: string;
  ownerName?: string;
  isEmpty?: boolean;
};
