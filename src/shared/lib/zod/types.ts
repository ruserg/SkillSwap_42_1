import { z } from "zod";
import { userSchema, updateUserSchema } from "./schemas/userSchema";
import { loginSchema, signupStep1Schema } from "./schemas/userAuthSchema";
import { createSkillSchema, updateSkillSchema } from "./schemas/skillSchema";
import {
  storeSchema,
  authStateSchema,
  appStateSchema,
  settingsSchema,
} from "./schemas/storeSchema";

// Экспорт всех типов
export type User = z.infer<typeof userSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupStep1Data = z.infer<typeof signupStep1Schema>;
export type CreateSkillData = z.infer<typeof createSkillSchema>;
export type UpdateSkillData = z.infer<typeof updateSkillSchema>;
export type AuthState = z.infer<typeof authStateSchema>;
export type AppState = z.infer<typeof appStateSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Store = z.infer<typeof storeSchema>;

// Утилитарные типы
export type ValidationResult<T = any> = {
  isValid: boolean;
  data: T | null;
  errors: Record<string, string>;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
