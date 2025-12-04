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
  .max(500, { message: "Описание не должно превышать 500 символов" })
  .optional();

export const skillCategorySchema = z
  .string()
  .min(1, { message: "Выберите категорию" });

export const skillSubcategorySchema = z
  .string()
  .min(1, { message: "Выберите подкатегорию" });

export const skillImageSchema = z
  .instanceof(File)
  .refine(
    (file) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      return allowedTypes.includes(file.type);
    },
    { message: "Поддерживаются только JPEG и PNG изображения" },
  )
  .refine(
    (file) => {
      const maxSize = 2 * 1024 * 1024;
      return file.size <= maxSize;
    },
    { message: "Размер изображения не должен превышать 2MB" },
  );

//Это поле взято из документации
export const skillTagsSchema = z
  .array(z.string())
  .max(5, { message: "Максимум 5 тегов" });

// Полная схема создания навыка
export const createSkillSchema = z.object({
  title: skillTitleSchema,
  description: skillDescriptionSchema,
  category: skillCategorySchema,
  subcategory: skillSubcategorySchema,
  image: skillImageSchema,
  tags: skillTagsSchema,
});

export const updateSkillSchema = createSkillSchema.partial();
