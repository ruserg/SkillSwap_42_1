import type { TUser } from "@entities/user/types";
import type { TCategory, TSubcategory } from "@entities/category/types";
import type { TCity } from "@entities/city/types";
import type { TSkill } from "@entities/skill/types";
import type { INotification } from "@entities/notification/types";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@shared/lib/types/api";
import type { User } from "@entities/user/types";

// Конфигурация API из переменных окружения
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Класс ошибки API с информацией о статусе
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

import { getCookie, setCookie, removeCookie } from "@shared/lib/cookies";

// Функция для получения токена из cookies
const getToken = () => {
  return getCookie("accessToken") || "";
};

// Базовая функция для выполнения запросов
async function fetchApi<T>(
  url: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["authorization"] = `Bearer ${token}`;
  }

  const fullUrl = `${API_BASE_URL}${url}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // Если токен истек (403) и это не повторный запрос, пытаемся обновить токен
  if (res.status === 403 && !isRetry && url !== "/api/auth/refresh") {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(
          `${API_BASE_URL}/api/auth/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          },
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setCookie("accessToken", refreshData.accessToken);
          // Повторяем оригинальный запрос с новым токеном
          return fetchApi<T>(url, options, true);
        } else {
          // Refresh токен тоже истек - очищаем и редиректим
          removeCookie("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Ошибка обновления токена:", err);
      }
    }
  }

  if (!res.ok) {
    let errorMessage = res.statusText;
    let errorData: unknown;

    try {
      // Проверяем, есть ли тело ответа перед парсингом
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        errorData = await res.json();
        if (
          errorData &&
          typeof errorData === "object" &&
          "error" in errorData
        ) {
          errorMessage = (errorData as { error: string }).error;
        }
      }
    } catch {
      // Если не удалось распарсить JSON, используем statusText
    }

    throw new ApiError(errorMessage, res.status, errorData);
  }

  // Если статус 204 No Content, не пытаемся парсить JSON
  if (res.status === 204) {
    return undefined as T;
  }

  // Проверяем Content-Type перед парсингом JSON
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    return data;
  }

  // Если не JSON, возвращаем пустой ответ
  return undefined as T;
}

export const api = {
  // ========== АВТОРИЗАЦИЯ ==========
  register: (body: RegisterRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append("email", body.email);
    formData.append("password", body.password);
    formData.append("name", body.name);
    formData.append("avatar", body.avatar);
    if (body.firstName) formData.append("firstName", body.firstName);
    if (body.lastName) formData.append("lastName", body.lastName);
    if (body.dateOfBirth) formData.append("dateOfBirth", body.dateOfBirth);
    if (body.gender) formData.append("gender", body.gender);
    if (body.cityId) formData.append("cityId", body.cityId.toString());

    return fetchApi<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: formData,
    });
  },

  login: async (body: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await fetchApi<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  refreshToken: (body: RefreshTokenRequest): Promise<RefreshTokenResponse> =>
    fetchApi<RefreshTokenResponse>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMe: (): Promise<User> => fetchApi<User>("/api/auth/me"),

  logout: (body: RefreshTokenRequest): Promise<{ message: string }> =>
    fetchApi<{ message: string }>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // ========== ПОЛЬЗОВАТЕЛИ ==========
  getUsers: (): Promise<TUser[]> => fetchApi<TUser[]>("/api/users"),

  getUser: (id: number): Promise<TUser> => fetchApi<TUser>(`/api/users/${id}`),

  updateUser: (id: number, data: Partial<TUser>): Promise<TUser> =>
    fetchApi<TUser>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteUser: (id: number): Promise<void> =>
    fetchApi<void>(`/api/users/${id}`, {
      method: "DELETE",
    }),

  // ========== НАВЫКИ ==========
  getSkills: (params?: {
    userId?: number;
    subcategoryId?: number;
    type_of_proposal?: string;
  }): Promise<TSkill[]> => {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.append("userId", params.userId.toString());
    if (params?.subcategoryId)
      searchParams.append("subcategoryId", params.subcategoryId.toString());
    if (params?.type_of_proposal)
      searchParams.append("type_of_proposal", params.type_of_proposal);

    const query = searchParams.toString();
    return fetchApi<TSkill[]>(`/api/skills${query ? `?${query}` : ""}`);
  },

  getSkill: (id: number): Promise<TSkill> =>
    fetchApi<TSkill>(`/api/skills/${id}`),

  createSkill: (body: {
    subcategoryId: number;
    title: string;
    description: string;
    type_of_proposal: "offer" | "request";
    images?: string[];
  }): Promise<TSkill> =>
    fetchApi<TSkill>("/api/skills", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateSkill: (
    id: number,
    data: {
      title?: string;
      description?: string;
      subcategoryId?: number;
      type_of_proposal?: "offer" | "request";
      images?: string[];
    },
  ): Promise<TSkill> =>
    fetchApi<TSkill>(`/api/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSkill: (id: number): Promise<void> =>
    fetchApi<void>(`/api/skills/${id}`, {
      method: "DELETE",
    }),

  // ========== КАТЕГОРИИ ==========
  getCategories: (): Promise<TCategory[]> =>
    fetchApi<TCategory[]>("/api/categories"),

  getCategory: (id: number): Promise<TCategory> =>
    fetchApi<TCategory>(`/api/categories/${id}`),

  // ========== ПОДКАТЕГОРИИ ==========
  getSubcategories: (params?: {
    categoryId?: number;
  }): Promise<TSubcategory[]> => {
    if (params?.categoryId) {
      return fetchApi<TSubcategory[]>(
        `/api/subcategories?categoryId=${params.categoryId}`,
      );
    }
    return fetchApi<TSubcategory[]>("/api/subcategories");
  },

  getSubcategory: (id: number): Promise<TSubcategory> =>
    fetchApi<TSubcategory>(`/api/subcategories/${id}`),

  // ========== ГОРОДА ==========
  getCities: (): Promise<TCity[]> => fetchApi<TCity[]>("/api/cities"),

  getCity: (id: number): Promise<TCity> => fetchApi<TCity>(`/api/cities/${id}`),

  // ========== ЛАЙКИ ==========
  // Получить информацию о лайках для списка пользователей
  // Возвращает только счетчик лайков и статус лайка текущего пользователя
  getUsersLikesInfo: async (
    userIds: number[],
  ): Promise<import("@entities/like/types").TUserLikesInfo[]> => {
    const result = await fetchApi<
      import("@entities/like/types").TUserLikesInfo[]
    >("/api/likes/users-info", {
      method: "POST",
      body: JSON.stringify({ userIds }),
    });
    return result;
  },

  // Получить информацию о лайках одного пользователя
  getUserLikesInfo: (
    userId: number,
  ): Promise<import("@entities/like/types").TUserLikesInfo> =>
    fetchApi<import("@entities/like/types").TUserLikesInfo>(
      `/api/likes/users-info/${userId}`,
    ),

  // Создать лайк от пользователя к пользователю
  createLike: (body: {
    toUserId: number; // кому ставим лайк
  }): Promise<void> =>
    fetchApi<void>("/api/likes", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  deleteLike: (id: number): Promise<void> =>
    fetchApi<void>(`/api/likes/${id}`, {
      method: "DELETE",
    }),

  // Удалить лайк по пользователю (кому ставили лайк)
  deleteLikeByUserId: (toUserId: number): Promise<void> =>
    fetchApi<void>(`/api/likes?toUserId=${toUserId}`, {
      method: "DELETE",
    }),

  // ========== УВЕДОМЛЕНИЯ ==========
  // Получить все уведомления текущего пользователя
  getNotifications: (): Promise<INotification[]> =>
    fetchApi<INotification[]>("/api/notifications"),

  // Получить непрочитанные уведомления
  getUnreadNotifications: (): Promise<INotification[]> =>
    fetchApi<INotification[]>("/api/notifications/unread"),

  // Получить тост-уведомление
  getToastNotification: (): Promise<INotification> =>
    fetchApi<INotification>("/api/notifications/toast"),

  // Получить уведомление по ID
  getNotificationById: (id: string): Promise<INotification> =>
    fetchApi<INotification>(`/api/notifications/${id}`),

  // Отметить уведомление как прочитанное
  markNotificationAsRead: (id: string): Promise<INotification> =>
    fetchApi<INotification>(`/api/notifications/${id}/read`, {
      method: "PATCH",
    }),

  // Отметить все уведомления как прочитанные
  markAllNotificationsAsRead: (): Promise<{
    count: number;
    notifications: INotification[];
  }> =>
    fetchApi<{ count: number; notifications: INotification[] }>(
      "/api/notifications/read-all",
      {
        method: "PATCH",
      },
    ),

  // Удалить уведомление
  deleteNotification: (id: string): Promise<void> =>
    fetchApi<void>(`/api/notifications/${id}`, {
      method: "DELETE",
    }),

  // Удалить все уведомления текущего пользователя
  deleteAllNotifications: (): Promise<{ message: string; count: number }> =>
    fetchApi<{ message: string; count: number }>("/api/notifications", {
      method: "DELETE",
    }),

  // ========== HEALTH CHECK ==========
  healthCheck: (): Promise<{ status: string; message: string }> =>
    fetchApi<{ status: string; message: string }>("/api/health"),
};
