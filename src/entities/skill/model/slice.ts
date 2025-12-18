import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { TSkill } from "../types";
import type { RootState } from "@app/store/store";
import { api } from "@shared/api/api";

type SkillsDataState = {
  skills: TSkill[];
  isLoading: boolean;
  error: string | null;
};

const initialState: SkillsDataState = {
  skills: [],
  isLoading: false,
  error: null,
};

export const fetchSkillsData = createAsyncThunk(
  "skillsData/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const skills = await api.getSkills();
      // Маппим только title -> name, тип оставляем как есть из API
      const mappedSkills = (skills as any[]).map((skill) => ({
        ...skill,
        name: skill.title || skill.name || "", // Маппим title -> name
        type_of_proposal: skill.type_of_proposal as "offer" | "request",
      }));
      return {
        skills: mappedSkills as TSkill[],
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
    isLoading: skillsData.isLoading,
  }),
);

export const skillsDataReducer = skillsDataSlice.reducer;
