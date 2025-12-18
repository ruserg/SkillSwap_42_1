import type { ButtonHTMLAttributes } from "react";

export type TDecorButtonVariant =
  | "moon"
  | "bell"
  | "heart"
  | "heartFill"
  | "share"
  | "parameters";

export type TDecorButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: TDecorButtonVariant;
  notificationsCount?: number;
  isUser?: boolean;
};
