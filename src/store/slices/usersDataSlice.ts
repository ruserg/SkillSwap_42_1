import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { TUser } from "@/shared/types/types";
import type { RootState } from "@/store/store";
import { api } from "@/shared/api/mockApi";

// Типы для состояния
type UsersDataState = {
  users: TUser[];
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: UsersDataState = {
  users: [],
  isLoading: false,
  error: null,
};

// Асинхронный thunk для загрузки данных пользователей
export const fetchUsersData = createAsyncThunk(
  "usersData/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const usersData = await api.fetchAllUsersData();
      return {
        users: usersData.users,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка загрузки данных",
      );
    }
  },
);

// Slice
const usersDataSlice = createSlice({
  name: "usersData",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
        state.users = action.payload.users;
        state.error = null;
      })
      .addCase(fetchUsersData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = usersDataSlice.actions;

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

export default usersDataSlice.reducer;
