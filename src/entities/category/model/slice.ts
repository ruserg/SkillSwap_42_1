import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { TCategory, TSubcategory } from "../types";
import type { RootState } from "@app/store/store";
import { api } from "@shared/api/api";

type CategoryDataState = {
  categories: TCategory[];
  subcategories: TSubcategory[];
  isLoading: boolean;
  error: string | null;
};

const initialState: CategoryDataState = {
  categories: [],
  subcategories: [],
  isLoading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categoryData/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const [categoriesResult, subcategoriesResult] = await Promise.all([
        api.getCategories(),
        api.getSubcategories(),
      ]);

      return {
        categories: categoriesResult as TCategory[],
        subcategories: subcategoriesResult as TSubcategory[],
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка загрузки категорий",
      );
    }
  },
);

const categoryDataSlice = createSlice({
  name: "categoryData",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.subcategories = action.payload.subcategories;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = categoryDataSlice.actions;

// Базовый селектор для состояния категорий
const selectCategoryDataState = (state: RootState) => state.categoryData;

// Мемоизированный селектор для получения всех данных о категориях
export const selectCategoryData = createSelector(
  [selectCategoryDataState],
  (categoryData) => ({
    categories: categoryData.categories,
    subcategories: categoryData.subcategories,
    isLoading: categoryData.isLoading,
  }),
);

export const categoryDataReducer = categoryDataSlice.reducer;
