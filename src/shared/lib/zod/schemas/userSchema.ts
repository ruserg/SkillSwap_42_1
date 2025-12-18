import { z } from "zod";

export const nameSchema = z
  .string()
  .min(2, "Имя должно быть не менее 2 символов")
  .max(50, "Имя не должно превышать 50 символов")
  .min(1, "Введите имя");

export const dateOfBirthSchema = z
  .union([z.date(), z.string(), z.null()])
  .refine((value) => {
    // Проверка на пустое значение
    if (!value) return false;

    // Проверка валидности даты
    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value);
    }
    if (isNaN(date.getTime())) {
      return false;
    }
    const now = new Date();
    const minAgeDate = new Date();
    minAgeDate.setFullYear(now.getFullYear() - 999);
    const maxAgeDate = new Date();
    maxAgeDate.setFullYear(now.getFullYear() - 16);

    return date >= minAgeDate && date <= maxAgeDate;
  }, "Вам должно быть от 16 до 999 лет");

export const sexSchema = z.string().min(1, "Выберите значение из списка");

export const citySchema = z.string().min(1, "Выберите значение из списка");

export const categorySchema = z
  .array(z.string())
  .min(1, "Выберите хотя бы одну категорию");

export const subcategorySchema = z
  .array(z.string())
  .min(1, "Выберите хотя бы одну подкатегорию");

export const avatarSchema = z.string().min(1, "Загрузите аватар");

// Схема пользователя
export const userSchema = z.object({
  name: nameSchema,
  dateOfBirth: dateOfBirthSchema,
  sex: sexSchema,
  city: citySchema,
  category: categorySchema,
  subcategory: subcategorySchema,
  avatar: avatarSchema,
});

export const usersArraySchema = z.array(userSchema);

// Схема для обновления пользователя
export const updateUserSchema = userSchema.partial();
