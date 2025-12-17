import type { ReactNode } from "react";

type TSuccessMessageVariant = "successMessage" | "notificationMessage";

export type TSuccessMessageProps = {
  variant: TSuccessMessageVariant;
  className?: string;
  children?: ReactNode;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
};
