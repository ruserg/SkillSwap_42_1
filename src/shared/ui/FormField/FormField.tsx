import { Input } from "@shared/ui/Input/Input";
import formStyles from "@shared/ui/Form/form.module.scss";
import type { InputType } from "@shared/ui/Input/input.types";
import clsx from "clsx";

import type { InputHTMLAttributes } from "react";

interface FormFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label: string;
  type?: InputType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled,
}) => {
  return (
    <div
      className={clsx(
        type === "password"
          ? formStyles.passwordContainer
          : formStyles.emailContainer,
      )}
    >
      <label htmlFor={id}>{label}</label>
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <span className={formStyles.errorText}>{error}</span>}
    </div>
  );
};
