import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { TUser } from "../types";
import type { RootState } from "@app/store/store";
import { api } from "@shared/api/api";

// Тип пользователя в state (даты хранятся как строки для сериализации)
type UserInState = Omit<
  TUser,
  "dateOfBirth" | "dateOfRegistration" | "lastLoginDatetime"
> & {
  dateOfBirth: string;
  dateOfRegistration: string;
  lastLoginDatetime: string;
};

type UsersDataState = {
  users: UserInState[];
  isLoading: boolean;
  error: string | null;
};

const initialState: UsersDataState = {
  users: [],
  isLoading: false,
  error: null,
};

export const fetchUsersData = createAsyncThunk(
  "usersData/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const users = await api.getUsers();
      return {
        users: users as TUser[],
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка загрузки данных",
      );
    }
  },
);

export const updateUserInState = createAsyncThunk(
  "usersData/updateUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const user = await api.getUser(userId);
      return user as TUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка загрузки пользователя",
      );
    }
  },
);

const usersDataSlice = createSlice({
  name: "usersData",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Оптимистичное обновление лайков пользователя
    updateUserLikesOptimistic: (
      state,
      action: {
        payload: { userId: number; isLiked: boolean; likesCount: number };
      },
    ) => {
      const { userId, isLiked, likesCount } = action.payload;
      const user = state.users.find((u) => u.id === userId);
      if (user) {
        user.isLikedByCurrentUser = isLiked;
        user.likesCount = likesCount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users.map(
          (user): UserInState => ({
            ...user,
            dateOfBirth:
              typeof user.dateOfBirth === "string"
                ? user.dateOfBirth
                : String(user.dateOfBirth),
            dateOfRegistration:
              typeof user.dateOfRegistration === "string"
                ? user.dateOfRegistration
                : String(user.dateOfRegistration),
            lastLoginDatetime:
              typeof user.lastLoginDatetime === "string"
                ? user.lastLoginDatetime
                : String(user.lastLoginDatetime),
          }),
        );
        state.error = null;
      })
      .addCase(fetchUsersData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserInState.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = {
            ...updatedUser,
            dateOfBirth:
              typeof updatedUser.dateOfBirth === "string"
                ? updatedUser.dateOfBirth
                : String(updatedUser.dateOfBirth),
            dateOfRegistration:
              typeof updatedUser.dateOfRegistration === "string"
                ? updatedUser.dateOfRegistration
                : String(updatedUser.dateOfRegistration),
            lastLoginDatetime:
              typeof updatedUser.lastLoginDatetime === "string"
                ? updatedUser.lastLoginDatetime
                : String(updatedUser.lastLoginDatetime),
          };
        }
      });
  },
});

export const { clearError, updateUserLikesOptimistic } = usersDataSlice.actions;

// Базовый селектор для состояния пользователей
const selectUsersDataState = (state: RootState) => state.usersData;

// Мемоизированный селектор для получения пользователей с преобразованными датами
export const selectUsers = createSelector(
  [selectUsersDataState],
  (usersData): TUser[] => {
    return usersData.users.map((user) => ({
      ...user,
      dateOfBirth: new Date(user.dateOfBirth as unknown as string),
      dateOfRegistration: new Date(
        user.dateOfRegistration as unknown as string,
      ),
      lastLoginDatetime: new Date(user.lastLoginDatetime as unknown as string),
    }));
  },
);

// Мемоизированный селектор для получения всех данных пользователей
export const selectUsersData = createSelector(
  [selectUsers, selectUsersDataState],
  (users, usersData) => ({
    users,
    isLoading: usersData.isLoading,
  }),
);

export const usersDataReducer = usersDataSlice.reducer;
