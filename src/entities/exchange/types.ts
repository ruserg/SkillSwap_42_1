export type ExchangeStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "cancelled";

export interface Exchange {
  id: number;
  fromUserId: number;
  toUserId: number;
  fromSkillId: number;
  toSkillId: number;
  status: ExchangeStatus;
  createdAt: string;
  updatedAt: string;
  fromUser?: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  toUser?: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  fromSkill?: {
    id: number;
    name: string;
    description: string;
    images: string[];
    type_of_proposal: "offer" | "request";
  };
  toSkill?: {
    id: number;
    name: string;
    description: string;
    images: string[];
    type_of_proposal: "offer" | "request";
  };
}

export interface CreateExchangeRequest {
  fromUserId: number;
  toUserId: number;
  fromSkillId: number;
  toSkillId: number;
}

export interface ExchangeNotification {
  type: "exchange_accepted" | "exchange_rejected" | "exchange_completed";
  exchangeId: number;
  fromUserId: number;
  toUserId: number;
  toUserName: string;
  message: string;
  timestamp: string;
}
