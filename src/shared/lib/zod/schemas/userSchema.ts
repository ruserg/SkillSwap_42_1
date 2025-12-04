import { z } from "zod";

export const nameSchema = z
  .string()
  .min(2, "Имя должно быть не менее 2 символов")
  .max(50, "Имя не должно превышать 50 символов");

export const dateOfBirthSchema = z
  .date()
  .refine((date) => {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 999);
    return date >= minDate;
  }, "Возраст не должен превышать 999 лет")
  .refine((date) => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 16);
    return date <= maxDate;
  }, "Вам должно быть больше 16 лет").nullable;

export const sexSchema = z.string().min(1, "Выберите значение из списка");

export const citySchema = z.string().min(1, "Выберите значение из списка");

export const categorySchema = z.string().min(1, "Выберите значение из списка");

export const subcategorySchema = z
  .string()
  .min(1, "Выберите значение из списка");

// Схема пользователя
export const userSchema = z.object({
  name: nameSchema,
  dateOfBirth: dateOfBirthSchema,
  sex: sexSchema,
  city: citySchema,
  category: categorySchema,
  subcategory: subcategorySchema,
});

export const usersArraySchema = z.array(userSchema);

// Схема для обновления пользователя
export const updateUserSchema = userSchema.partial();
