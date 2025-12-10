import type { ButtonHTMLAttributes, MouseEventHandler } from "react";

export type TDecorButtonVariant =
  | "moon"
  | "bell"
  | "heart"
  | "heartFill"
  | "share"
  | "parameters";

export type TDecorButtonProps = {
  variant: TDecorButtonVariant;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  htmlType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  notificationsCount?: number;
  isUser?: boolean;
};
