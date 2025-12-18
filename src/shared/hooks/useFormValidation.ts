import { useEffect, useState } from "react";
import type { z } from "zod";

export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

interface UseFormValidationParams<T> {
  schema: z.ZodSchema<T>;
  initialValues: T;
  initialTouched?: FormTouched<T>;
}

export const useFormValidation = <T extends Record<string, any>>({
  schema,
  initialValues,
  initialTouched = {},
}: UseFormValidationParams<T>) => {
  const [formData, setFormData] = useState<T>(initialValues);
  const [touched, setTouched] = useState<FormTouched<T>>(initialTouched);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const result = schema.safeParse(formData);

    if (result.success) {
      setErrors({});
      setIsFormValid(true);
      return;
    }

    const newErrors: FormErrors<T> = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof T | undefined;

      if (field && touched[field]) {
        newErrors[field] = issue.message;
      }
    });

    setErrors(newErrors);
    setIsFormValid(false);
  }, [formData, touched, schema]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    setTouched((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  return {
    formData,
    setFormData,
    touched,
    setTouched,
    errors,
    isFormValid,
    handleInputChange,
  };
};
