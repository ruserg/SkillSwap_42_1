import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { TSkill, TLike } from "@/shared/types/types";
import type { RootState } from "@/store/store";
import { api } from "@/shared/api/mockApi";

// Типы для состояния
type SkillsDataState = {
  skills: TSkill[];
  likes: TLike[];
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: SkillsDataState = {
  skills: [],
  likes: [],
  isLoading: false,
  error: null,
};

// Асинхронный thunk для загрузки данных о навыках и лайках
export const fetchSkillsData = createAsyncThunk(
  "skillsData/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // Последовательная загрузка с задержкой для избежания rate limit
      const skillsData = await api.getSkills();
      await new Promise((resolve) => setTimeout(resolve, 200));
      const likesData = await api.getLikes();

      return {
        skills: skillsData as TSkill[],
        likes: likesData as TLike[],
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка загрузки данных о навыках",
      );
    }
  },
);

// Slice
const skillsDataSlice = createSlice({
  name: "skillsData",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkillsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSkillsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.skills = action.payload.skills;
        state.likes = action.payload.likes;
        state.error = null;
      })
      .addCase(fetchSkillsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = skillsDataSlice.actions;

// Базовый селектор для состояния навыков
const selectSkillsDataState = (state: RootState) => state.skillsData;

// Мемоизированный селектор для получения всех данных о навыках
export const selectSkillsData = createSelector(
  [selectSkillsDataState],
  (skillsData) => ({
    skills: skillsData.skills,
    likes: skillsData.likes,
    isLoading: skillsData.isLoading,
  }),
);

export default skillsDataSlice.reducer;
