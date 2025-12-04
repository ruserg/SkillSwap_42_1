import { z } from "zod";

export const emailSchema = z
  .string()
  .email({ message: "Введите корректный email адрес" })
  .min(1, { message: "Email обязателен для заполнения" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Пароль должен содержать не менее 8 знаков" })
  .regex(/^[A-Za-z0-9]*$/, {
    message: "Пароль может содержать только латинские буквы и цифры",
  })
  .regex(/[A-Z]/, {
    message: "Пароль должен содержать хотя бы одну заглавную латинскую букву",
  })
  .regex(/[a-z]/, {
    message: "Пароль должен содержать хотя бы одну строчную латинскую букву",
  })
  .regex(/[0-9]/, {
    message: "Пароль должен содержать хотя бы одну цифру",
  })
  .min(1, { message: "Пароль обязателен для заполнения" });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupStep1Schema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignupStep1Data = z.infer<typeof signupStep1Schema>;
