import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { INotification } from "../types";
import type { RootState } from "@app/store/store";
import { api } from "@shared/api/api";

// Типы для состояния
type NotificationsState = {
  notifications: INotification[];
  toast: INotification | null; // Текущее тост-уведомление
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: NotificationsState = {
  notifications: [],
  toast: null,
  isLoading: false,
  error: null,
};

// Асинхронный thunk для загрузки всех уведомлений
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const notifications = await api.getNotifications();
      return notifications;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка загрузки уведомлений",
      );
    }
  },
);

// Асинхронный thunk для загрузки непрочитанных уведомлений
export const fetchUnreadNotifications = createAsyncThunk(
  "notifications/fetchUnread",
  async (_, { rejectWithValue }) => {
    try {
      const notifications = await api.getUnreadNotifications();
      return notifications;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка загрузки непрочитанных уведомлений",
      );
    }
  },
);

// Асинхронный thunk для загрузки тост-уведомления
export const fetchToastNotification = createAsyncThunk(
  "notifications/fetchToast",
  async (_, { rejectWithValue }) => {
    try {
      const toast = await api.getToastNotification();
      return toast;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка загрузки тост-уведомления",
      );
    }
  },
);

// Асинхронный thunk для получения уведомления по ID
export const fetchNotificationById = createAsyncThunk(
  "notifications/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const notification = await api.getNotificationById(id);
      return notification;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка загрузки уведомления",
      );
    }
  },
);

// Асинхронный thunk для отметки уведомления как прочитанного
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id: string, { rejectWithValue }) => {
    try {
      const notification = await api.markNotificationAsRead(id);
      return notification;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка отметки уведомления как прочитанного",
      );
    }
  },
);

// Асинхронный thunk для отметки всех уведомлений как прочитанных
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const result = await api.markAllNotificationsAsRead();
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка отметки всех уведомлений как прочитанных",
      );
    }
  },
);

// Асинхронный thunk для удаления уведомления
export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteNotification(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка удаления уведомления",
      );
    }
  },
);

// Асинхронный thunk для удаления всех уведомлений
export const deleteAllNotifications = createAsyncThunk(
  "notifications/deleteAll",
  async (_, { rejectWithValue }) => {
    try {
      await api.deleteAllNotifications();
      return;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка удаления всех уведомлений",
      );
    }
  },
);

// Slice
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearToast: (state) => {
      state.toast = null;
    },
    // Оптимистичное обновление статуса прочитанности
    markAsReadOptimistic: (state, action: { payload: string }) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload,
      );
      if (notification) {
        notification.isRead = true;
      }
      if (state.toast?.id === action.payload) {
        state.toast.isRead = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        // Данные уже отформатированы в API
        const notifications = action.payload;

        // Если есть тост в state.toast и он есть в новом списке, заменяем его на уже отформатированный
        // чтобы избежать мерцания (state.toast уже отформатирован)
        if (state.toast) {
          const toastIndex = notifications.findIndex(
            (n) => n.id === state.toast?.id,
          );
          if (toastIndex !== -1) {
            notifications[toastIndex] = state.toast;
          }
          // Если тоста нет в новом списке, не добавляем его - тосты показываются отдельно
        }

        state.notifications = notifications;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchUnreadNotifications
      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        // Обновляем только непрочитанные уведомления (данные уже отформатированы в API)
        action.payload.forEach((notification) => {
          const index = state.notifications.findIndex(
            (n) => n.id === notification.id,
          );
          if (index !== -1) {
            state.notifications[index] = notification;
          } else {
            state.notifications.push(notification);
          }
        });
        state.error = null;
      })
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchToastNotification
      .addCase(fetchToastNotification.fulfilled, (state, action) => {
        // Данные уже отформатированы в API
        state.toast = action.payload;
        // Тост не добавляется в список уведомлений, он показывается отдельно
      })
      .addCase(fetchToastNotification.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // fetchNotificationById
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        // Данные уже отформатированы в API
        const notification = action.payload;
        const index = state.notifications.findIndex(
          (n) => n.id === notification.id,
        );
        if (index !== -1) {
          state.notifications[index] = notification;
        } else {
          state.notifications.push(notification);
        }
      })
      // markNotificationAsRead
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        // Данные уже отформатированы в API
        const notification = action.payload;
        const index = state.notifications.findIndex(
          (n) => n.id === notification.id,
        );
        if (index !== -1) {
          state.notifications[index] = notification;
        }
        if (state.toast?.id === notification.id) {
          state.toast = notification;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // markAllNotificationsAsRead
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        // Обновляем все уведомления из ответа (данные уже отформатированы в API)
        action.payload.notifications.forEach((notification) => {
          const index = state.notifications.findIndex(
            (n) => n.id === notification.id,
          );
          if (index !== -1) {
            state.notifications[index] = notification;
          }
          // Если это тост, обновляем его
          if (state.toast?.id === notification.id) {
            state.toast = notification;
          }
        });
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // deleteNotification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload,
        );
        if (state.toast?.id === action.payload) {
          state.toast = null;
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // deleteAllNotifications
      .addCase(deleteAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.toast = null;
      })
      .addCase(deleteAllNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearToast, markAsReadOptimistic } =
  notificationsSlice.actions;

// Базовый селектор для состояния уведомлений
const selectNotificationsState = (state: RootState) => state.notifications;

// Селектор для получения всех уведомлений
export const selectNotifications = createSelector(
  [selectNotificationsState],
  (notificationsState) => notificationsState.notifications,
);

// Селектор для получения непрочитанных уведомлений
export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter((n) => !n.isRead),
);

// Селектор для получения количества непрочитанных уведомлений
export const selectUnreadNotificationsCount = createSelector(
  [selectUnreadNotifications],
  (unreadNotifications) => unreadNotifications.length,
);

// Селектор для получения тост-уведомления
export const selectToast = createSelector(
  [selectNotificationsState],
  (notificationsState) => notificationsState.toast,
);

// Селектор для получения уведомления по ID
export const selectNotificationById = (id: string) =>
  createSelector([selectNotifications], (notifications) =>
    notifications.find((n) => n.id === id),
  );

// Селектор для получения всех данных уведомлений
export const selectNotificationsData = createSelector(
  [selectNotifications, selectNotificationsState],
  (notifications, notificationsState) => ({
    notifications,
    isLoading: notificationsState.isLoading,
    error: notificationsState.error,
  }),
);

// Селектор для проверки загрузки
export const selectNotificationsLoading = createSelector(
  [selectNotificationsState],
  (notificationsState) => notificationsState.isLoading,
);

export const notificationsReducer = notificationsSlice.reducer;
