import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { TUserLikesInfo } from "../types";
import type { RootState } from "@app/store/store";
import { api } from "@shared/api/api";

type LikesState = {
  usersLikesInfo: Record<number, TUserLikesInfo>; // Map userId -> likes info
  isLoading: boolean;
  error: string | null;
};

const initialState: LikesState = {
  usersLikesInfo: {},
  isLoading: false,
  error: null,
};

export const fetchUsersLikesInfo = createAsyncThunk(
  "likes/fetchUsersInfo",
  async (userIds: number[], { rejectWithValue }) => {
    try {
      const likesInfo = await api.getUsersLikesInfo(userIds);
      return likesInfo;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка загрузки информации о лайках",
      );
    }
  },
);

export const createLike = createAsyncThunk(
  "likes/createLike",
  async (params: { toUserId: number }, { rejectWithValue }) => {
    try {
      await api.createLike({
        toUserId: params.toUserId,
      });
      return params.toUserId;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка создания лайка";
      if (
        errorMessage.includes("уже существует") ||
        errorMessage.includes("already exists")
      ) {
        return params.toUserId;
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export const deleteLike = createAsyncThunk(
  "likes/deleteLike",
  async (toUserId: number, { rejectWithValue }) => {
    try {
      await api.deleteLikeByUserId(toUserId);
      return toUserId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка удаления лайка",
      );
    }
  },
);

export const fetchUserLikesInfo = createAsyncThunk(
  "likes/fetchUserInfo",
  async (userId: number, { rejectWithValue }) => {
    try {
      const likesInfo = await api.getUserLikesInfo(userId);
      return likesInfo;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка загрузки информации о лайках",
      );
    }
  },
);

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersLikesInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersLikesInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload.forEach((info) => {
          state.usersLikesInfo[info.userId] = info;
        });
        state.error = null;
      })
      .addCase(fetchUsersLikesInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserLikesInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserLikesInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.usersLikesInfo[action.payload.userId] = action.payload;
        state.error = null;
      })
      .addCase(fetchUserLikesInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createLike.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteLike.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = likesSlice.actions;

// Базовый селектор для состояния лайков
const selectLikesState = (state: RootState) => state.likes;

// Селектор для получения информации о лайках пользователя
export const selectUserLikesInfo = (userId: number) =>
  createSelector([selectLikesState], (likesData) => {
    return (
      likesData.usersLikesInfo[userId] || {
        userId,
        likesCount: 0,
        isLikedByCurrentUser: false,
      }
    );
  });

// Селектор для получения информации о лайках нескольких пользователей
export const selectUsersLikesInfo = (userIds: number[]) =>
  createSelector([selectLikesState], (likesData) => {
    return userIds.map((userId) => {
      return (
        likesData.usersLikesInfo[userId] || {
          userId,
          likesCount: 0,
          isLikedByCurrentUser: false,
        }
      );
    });
  });

// Селектор для проверки загрузки
export const selectLikesLoading = createSelector(
  [selectLikesState],
  (likesData) => likesData.isLoading,
);

export const likesReducer = likesSlice.reducer;
