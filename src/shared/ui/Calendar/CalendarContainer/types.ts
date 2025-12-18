import type { ReactNode } from "react";

export type TCalendarContainer = {
  children: ReactNode;
  className?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};
