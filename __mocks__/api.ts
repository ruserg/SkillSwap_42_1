export const api = {
  // Users
  getUsers: async () => [],
  getUser: async () => null,

  // Auth (добавили для thunk-тестов)
  getCurrentUser: async () => null,
  login: async () => ({ accessToken: "at", refreshToken: "rt", user: null }),
  register: async () => ({ accessToken: "at", refreshToken: "rt", user: null }),
  logout: async () => undefined,
  updateCurrentUser: async () => null,
  changePassword: async () => ({ ok: true }),

  // Notifications (добавили для thunk-тестов)
  getNotifications: async () => [],
  getUnreadNotifications: async () => [],
  getToastNotification: async () => null,
  getNotificationById: async () => null,
  markNotificationAsRead: async () => null,
  markAllNotificationsAsRead: async () => ({ notifications: [] }),
  deleteNotification: async () => undefined,
  deleteAllNotifications: async () => undefined,

  // Skills
  getSkills: async () => [],

  // Skills create (нужно для signup thunks)
  createSkill: async () => ({ id: 1 }),

  // Cities
  getCities: async () => [],

  // Categories
  getCategories: async () => [],
  getSubcategories: async () => [],

  // Likes
  getUsersLikesInfo: async () => [],
  getUserLikesInfo: async (userId: number) => ({
    userId,
    likesCount: 0,
    isLikedByCurrentUser: false,
  }),
  createLike: async () => undefined,
  deleteLikeByUserId: async () => undefined,

  // Exchange (добавили для thunk-тестов)
  createExchange: async () => ({
    id: 1,
    fromUserId: 1,
    toUserId: 2,
    fromSkillId: 1,
    toSkillId: 2,
    status: "pending",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  }),
  getExchangeStatus: async () => ({
    status: "pending",
    message: "ok",
    updatedAt: "2024-01-01",
  }),
  getExchange: async () => ({
    id: 1,
    fromUserId: 1,
    toUserId: 2,
    fromSkillId: 1,
    toSkillId: 2,
    status: "pending",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  }),
};

export const API_BASE_URL = "http://localhost:5173";

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
