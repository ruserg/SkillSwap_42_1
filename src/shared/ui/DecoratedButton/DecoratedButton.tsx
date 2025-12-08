import styles from "./decoratedButton.module.scss";
import clsx from "clsx";
import type { TDecorButtonProps } from "@shared/ui/DecoratedButton/types";

export const DecoratedButton = (props: TDecorButtonProps) => {
  const {
    variant = "heart",
    className,
    disabled = false,
    onClick,
    htmlType = "button",
    notificationsCount,
  } = props;

  const getButtonClass = () => {
    if (variant === "heart") {
      return styles.buttonHeart;
    }
    if (variant === "heartFill") {
      return styles.buttonHeartFill;
    }
    if (variant === "moon") {
      return styles.buttonMoon;
    }
    if (variant === "bell") {
      return notificationsCount ? styles.buttonBellFill : styles.buttonBell;
    }
    if (variant === "share") {
      return styles.buttonShare;
    }
    if (variant === "parameters") {
      return styles.buttonParameters;
    }
    return styles.buttonHeart;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.decorButton, getButtonClass(), className)}
      type={htmlType}
    ></button>
  );
};
