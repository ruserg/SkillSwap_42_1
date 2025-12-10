import type { FC } from "react";
import type { TArrowProps } from "@shared/ui/Arrow/types";
import { Chevron } from "./svg/ArrowButtonSvg";
// Данный компонент отображает стрелку для раскрывающегося списка

export const Arrow: FC<TArrowProps> = (props) => {
  const { isOpen, color = "black" } = props;

  return (
    <Chevron
      isOpen={isOpen}
      color={color}
      aria-label={isOpen ? "Стелочка наверх" : "Стелочка вниз"}
      aria-hidden="true"
    />
  );
};
