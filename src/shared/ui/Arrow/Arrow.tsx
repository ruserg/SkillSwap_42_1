import type { FC } from "react";
import type { TArrowProps } from "@shared/ui/Arrow/types";
import { Chevron } from "./svg/ArrowButtonSvg";

export const Arrow: FC<TArrowProps> = (props) => {
  const { isOpen, color = "black", ...restProps } = props;

  return (
    <span
      {...restProps}
      aria-label={isOpen ? "Стелочка наверх" : "Стелочка вниз"}
      aria-hidden="true"
    >
      <Chevron isOpen={isOpen} color={color} />
    </span>
  );
};
