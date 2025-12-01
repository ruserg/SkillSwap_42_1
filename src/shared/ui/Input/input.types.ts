import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "date"
  | "radio"
  | "checkbox"
  | "search";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: InputType;
  placeholder?: string;
  value?: string;
  onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
  checked?: boolean;
  children?: ReactNode;
  isOpenList?: boolean;
  isShowPassword?: boolean;
}
