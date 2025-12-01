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
  } = props;

  return (
    <>
      {variant === "heart" && (
        <button
          onClick={onClick}
          disabled={disabled}
          className={clsx(styles.decorButton, styles.buttonHeart, className)}
          type={htmlType}
        ></button>
      )}
      {variant === "heartFill" && (
        <button
          onClick={onClick}
          disabled={disabled}
          className={clsx(
            styles.decorButton,
            styles.buttonHeartFill,
            className,
          )}
          type={htmlType}
        ></button>
      )}
      {variant === "moon" && (
        <button
          onClick={onClick}
          disabled={disabled}
          className={clsx(styles.decorButton, styles.buttonMoon, className)}
          type={htmlType}
        ></button>
      )}
      {variant === "bell" && (
        <button
          onClick={onClick}
          disabled={disabled}
          className={clsx(styles.decorButton, styles.buttonBell, className)}
          type={htmlType}
        ></button>
      )}
      {variant === "share" && (
        <button
          onClick={onClick}
          disabled={disabled}
          className={clsx(styles.decorButton, styles.buttonShare, className)}
          type={htmlType}
        ></button>
      )}
      {variant === "parameters" && (
        <button
          onClick={onClick}
          disabled={disabled}
          className={clsx(
            styles.decorButton,
            styles.buttonParameters,
            className,
          )}
          type={htmlType}
        ></button>
      )}
    </>
  );
};
