import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@shared/api/api";
import type { User } from "@entities/user/types";
import type { RootState } from "@app/store/store";
import { getCookie, setCookie, removeCookie } from "@shared/lib/cookies";
import type { LoginRequest, RegisterRequest } from "@shared/lib/types/api";

type AuthState = {
  user: User | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  refreshToken: localStorage.getItem("refreshToken"),
  isLoading: false,
  error: null,
};

// Загрузка текущего пользователя
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await api.getMe();
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка загрузки пользователя",
      );
    }
  },
);

// Вход
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await api.login(credentials);
      setCookie("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка входа";
      return rejectWithValue(errorMessage);
    }
  },
);

// Регистрация
export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await api.register(data);
      setCookie("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка регистрации",
      );
    }
  },
);

// Выход
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.logout({ refreshToken });
      }
      removeCookie("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    } catch (error) {
      // Даже если запрос не удался, очищаем хранилище
      removeCookie("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка выхода",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchUser
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.refreshToken = null;
        removeCookie("accessToken");
        localStorage.removeItem("refreshToken");
      });

    // login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Все равно очищаем состояние при ошибке
        state.user = null;
        state.refreshToken = null;
      });
  },
});

export const { clearError } = authSlice.actions;

// Селекторы
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => {
  const hasToken = !!getCookie("accessToken");
  const hasUser = !!state.auth.user;
  const isLoading = state.auth.isLoading;

  // Если есть токен и идет загрузка пользователя, считаем авторизованным
  // чтобы избежать редиректов во время загрузки
  if (hasToken && isLoading) {
    return true;
  }

  return hasToken && hasUser;
};
export const selectUser = (state: RootState) => state.auth.user;

export const authReducer = authSlice.reducer;
