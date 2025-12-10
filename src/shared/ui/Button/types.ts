import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "react-router-dom";

type TButtonVariant = "primary" | "secondary" | "tertiary" | "signup";

export type TBaseButtonProps = {
  variant?: TButtonVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
};

export type TButtonAsButton = TBaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled"> & {
    to?: never;
  };

export type TButtonAsLink = TBaseButtonProps &
  LinkProps & {
    to: LinkProps["to"];
    type?: never;
  };

export type TButtonProps = TButtonAsButton | TButtonAsLink;
