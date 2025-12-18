import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { TCity } from "../types";
import type { RootState } from "@app/store/store";
import { api } from "@shared/api/api";

type CitiesState = {
  cities: TCity[];
  isLoading: boolean;
  error: string | null;
};

const initialState: CitiesState = {
  cities: [],
  isLoading: false,
  error: null,
};

export const fetchCities = createAsyncThunk(
  "cities/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const cities = await api.getCities();
      return {
        cities: cities as TCity[],
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка загрузки городов",
      );
    }
  },
);

const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities = action.payload.cities;
        state.error = null;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = citiesSlice.actions;

// Базовый селектор для состояния городов
const selectCitiesState = (state: RootState) => state.cities;

// Мемоизированный селектор для получения всех городов
export const selectCities = createSelector(
  [selectCitiesState],
  (citiesData) => ({
    cities: citiesData.cities,
    isLoading: citiesData.isLoading,
  }),
);

export const citiesReducer = citiesSlice.reducer;
