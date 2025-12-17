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

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onInput"> {
  type: InputType;
  onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  isOpenList?: boolean;
  isBlockCheckedLabel?: boolean;
  openListFunction?: () => void;
  isShowPassword?: boolean;
}
