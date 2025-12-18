import clsx from "clsx";
import styles from "./errorMessage.module.scss";
import type { HTMLAttributes } from "react";

interface ErrorMessageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  children: React.ReactNode;
}

export const ErrorMessage = ({
  children,
  className,
  ...restProps
}: ErrorMessageProps) => {
  return (
    <div
      {...restProps}
      className={clsx(styles.errorMessage, className)}
      role="alert"
    >
      {children}
    </div>
  );
};
