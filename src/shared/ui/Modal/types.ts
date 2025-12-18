import type { ReactNode } from "react";

export type TModalUIProps = {
  onClose: () => void;
  children?: ReactNode;
  titleId?: string;
  descriptionId?: string;
};
