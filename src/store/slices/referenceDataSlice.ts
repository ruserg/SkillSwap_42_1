import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { TCity, TCategory, TSubcategory } from "@/shared/types/types";
import type { RootState } from "@/store/store";
import { api } from "@/shared/api/mockApi";

// Типы для состояния
type ReferenceDataState = {
  cities: TCity[];
  categories: TCategory[];
  subcategories: TSubcategory[];
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: ReferenceDataState = {
  cities: [],
  categories: [],
  subcategories: [],
  isLoading: false,
  error: null,
};

// Асинхронный thunk для загрузки справочных данных
export const fetchReferenceData = createAsyncThunk(
  "referenceData/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // Последовательная загрузка с задержками для избежания rate limit
      const citiesData = await api.getCities();
      await new Promise((resolve) => setTimeout(resolve, 200));
      const categoriesData = await api.getCategories();
      await new Promise((resolve) => setTimeout(resolve, 200));
      const subcategoriesData = await api.getSubcategories();

      // cities может быть массивом или объектом с полем cities
      const citiesArray: TCity[] = Array.isArray(citiesData)
        ? citiesData
        : (citiesData as { cities: TCity[] }).cities || [];

      return {
        cities: citiesArray,
        categories: categoriesData as TCategory[],
        subcategories: subcategoriesData as TSubcategory[],
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка загрузки справочных данных",
      );
    }
  },
);

// Slice
const referenceDataSlice = createSlice({
  name: "referenceData",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferenceData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReferenceData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities = action.payload.cities;
        state.categories = action.payload.categories;
        state.subcategories = action.payload.subcategories;
        state.error = null;
      })
      .addCase(fetchReferenceData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = referenceDataSlice.actions;

// Базовый селектор для состояния справочных данных
const selectReferenceDataState = (state: RootState) => state.referenceData;

// Мемоизированный селектор для получения всех справочных данных
export const selectReferenceData = createSelector(
  [selectReferenceDataState],
  (referenceData) => ({
    cities: referenceData.cities,
    categories: referenceData.categories,
    subcategories: referenceData.subcategories,
    isLoading: referenceData.isLoading,
  }),
);

export default referenceDataSlice.reducer;
