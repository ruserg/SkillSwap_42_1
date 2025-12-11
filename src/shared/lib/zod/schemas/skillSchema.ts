import { z } from "zod";

export const skillTitleSchema = z
  .string()
  .min(3, { message: "Название должно быть не менее 3 символов" })
  .max(50, { message: "Название не должно превышать 50 символов" })
  .regex(/^[А-Яа-яA-Za-z0-9\s\-_,.!?()]+$/, {
    message: "Название содержит недопустимые символы",
  })
  .min(1, { message: "Введите название навыка" });

export const skillDescriptionSchema = z
  .string()
  .min(10, { message: "Описание должно быть не менее 10 символов" })
  .max(500, { message: "Описание не должно превышать 500 символов" })
  .min(1, { message: "Введите описание навыка" });

export const skillCategorySchema = z
  .array(z.string())
  .min(1, { message: "Выберите хотя бы одну категорию" });

export const skillSubcategorySchema = z
  .array(z.string())
  .min(1, { message: "Выберите хотя бы одну подкатегорию" })
  .max(5, { message: "Максимум 5 подкатегорий" });

export const skillImageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      return allowedTypes.includes(file.type);
    },
    { message: "Поддерживаются только JPEG, PNG и WebP изображения" },
  )
  .refine(
    (file) => {
      const maxSize = 2 * 1024 * 1024;
      return file.size <= maxSize;
    },
    { message: "Размер изображения не должен превышать 2MB" },
  );

export const skillImagesArraySchema = z
  .array(z.string())
  .min(1, { message: "Добавьте хотя бы одно изображение" })
  .max(5, { message: "Максимум 5 изображений" });

export const signupStep3Schema = z.object({
  title: skillTitleSchema,
  description: skillDescriptionSchema,
  category: skillCategorySchema,
  subcategory: skillSubcategorySchema,
  images: skillImagesArraySchema,
});

export const updateSkillSchema = signupStep3Schema.partial();

export type SignupStep3Data = z.infer<typeof signupStep3Schema>;
