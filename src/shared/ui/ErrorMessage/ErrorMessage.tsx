import clsx from "clsx";
import styles from "./errorMessage.module.scss";

interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export const ErrorMessage = ({ children, className }: ErrorMessageProps) => {
  return (
    <div className={clsx(styles.errorMessage, className)} role="alert">
      {children}
    </div>
  );
};
