import type { HTMLAttributes } from "react";

export type TArrowProps = HTMLAttributes<HTMLSpanElement> & {
  isOpen: boolean;
  color?: "green" | "black";
};
