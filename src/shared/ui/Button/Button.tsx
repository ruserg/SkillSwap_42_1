import type { TButtonAsButton, TButtonAsLink, TButtonProps } from "./types";
import clsx from "clsx";
import styles from "./button.module.scss";
import { Link } from "react-router-dom";

//Компонент Button принимает один обязательный пропс children для отображения текста
//внутри кнопки. Если в пропсах больше ничего не передать, то по умолчанию кнопка становится
//вариантом primary (зеленая кнопка из макета, которая используется в большинстве случаев),
//а так же type='Button'. Для изменения варианта кнопки есть пропс variant - куда
//строкой может быть передан вариант из макета (можно их посмотреть в types).
//Пропсы leftIcon и rightIcon нужны для передачи иконки рядом с текстом кнопки.
//Если передать пропс to в компонент, то будет рендерится компонент Link, вместо Button.
export const Button = (props: TButtonProps) => {
  const {
    children,
    type = "button",
    variant = "primary",
    disabled = false,
    leftIcon,
    rightIcon,
    isLoading,
    otherClassNames,
    ...otherProps
  } = props;

  const variantWithFallback = variant && styles[variant] ? variant : "primary";
  const isDisabled = disabled || isLoading;

  if ("to" in props) {
    const { to, ...linkProps } = otherProps as TButtonAsLink;
    return (
      <Link
        to={to}
        className={clsx(
          styles.button,
          styles[variantWithFallback],
          isDisabled && styles.disabled,
        )}
        aria-disabled={isDisabled}
        aria-busy={isLoading || undefined}
        aria-live={isLoading ? "polite" : undefined}
        {...linkProps}
      >
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        {isLoading ? "Загрузка..." : children}
        {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </Link>
    );
  }

  const { onClick, ...buttonProps } = otherProps as TButtonAsButton;

  return (
    <button
      className={clsx(
        styles.button,
        styles[variantWithFallback],
        otherClassNames,
      )}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading || undefined}
      aria-live={isLoading ? "polite" : undefined}
      {...buttonProps}
    >
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      {isLoading ? "Загрузка..." : children}
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
};
