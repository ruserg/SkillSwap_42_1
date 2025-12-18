import { z } from "zod";
import { userSchema } from "./userSchema";

// Схема состояния аутентификации
export const authStateSchema = z.object({
  user: userSchema.optional().nullable(),
  token: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  isLoading: z.boolean().default(false),
  error: z.string().optional().nullable(),
});

// Схема состояния приложения
export const appStateSchema = z.object({
  isInitialized: z.boolean().default(false),
  isLoading: z.boolean().default(false),
  error: z.string().optional().nullable(),
  lastError: z
    .object({
      message: z.string(),
      timestamp: z.string().datetime(),
      code: z.string().optional(),
    })
    .optional()
    .nullable(),
});

// Схема настроек приложения
export const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "auto"]).default("light"),
  language: z.enum(["ru", "en"]).default("ru"),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sound: z.boolean().default(false),
  }),
});

// Схема стора
export const storeSchema = z.object({
  auth: authStateSchema,
  app: appStateSchema,
  settings: settingsSchema,
  users: z.array(userSchema).default([]),
  currentUser: userSchema.optional().nullable(),
});

export type Store = z.infer<typeof storeSchema>;
