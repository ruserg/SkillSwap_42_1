import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { LinkProps } from "react-router-dom";

type TButtonVariant = "primary" | "secondary" | "tertiary" | "signup";

export type TBaseButtonProps = {
  variant?: TButtonVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  otherClassNames?: string;
};

export type TButtonAsButton = TBaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never;
  };

export type TButtonAsLink = TBaseButtonProps &
  LinkProps & {
    to: LinkProps["to"];
    type?: never;
  };

export type TButtonProps = TButtonAsButton | TButtonAsLink;
