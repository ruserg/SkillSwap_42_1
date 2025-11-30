import type { TButtonProps } from "./type.ts";
import clsx from "clsx";
import styles from "./button.module.scss";
import { Link } from "react-router-dom";

//Компонент Button принимает один обязательный пропс children для отображения текста
//внутри кнопки. Если в пропсах больше ничего не передать, то по умолчанию кнопка становится
//вариантом primary (зеленая кнопка из макета, которая используется в большинстве случаев),
//а так же type='button'. Для изменения варианта кнопки есть пропс variant - куда
//строкой может быть передан вариант из макета (можно их посмотреть в types).
//Пропсы leftIcon и rightIcon нужны для передачи иконки рядом с текстом кнопки.
//Если передать пропс to в компонент, то будет рендерится компонент Link, вместо button.
export const Button = (props: TButtonProps) => {
  const {
    children,
    htmlType = "button",
    variant = "primary",
    disabled = false,
    leftIcon,
    rightIcon,
    onClick,
    to,
  } = props;

  if (to) {
    return (
      <Link
        to={to}
        className={clsx(
          styles.button,
          styles[variant],
          disabled && styles.disabled,
        )}
        aria-disabled={disabled}
      >
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        {children}
        {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </Link>
    );
  }

  return (
    <button
      className={clsx(styles.button, styles[variant])}
      type={htmlType}
      disabled={disabled}
      onClick={onClick}
    >
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
};
