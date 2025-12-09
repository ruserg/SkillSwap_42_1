import clsx from "clsx";
import arrow from "@shared/assets/images/icons/chevron-down.svg";
import type { FC } from "react";
import type { TArrowProps } from "@shared/ui/Arrow/types";
import styles from "./arrow.module.scss";

// Данный компонент отображает стрелку для раскрывающегося списка

export const Arrow: FC<TArrowProps> = ({ isOpen }) => {
  return (
    <img
      src={arrow}
      alt="иконка стрелочки"
      className={clsx(styles.arrow, { [styles.arrowOpen]: isOpen })}
    />
  );
};
