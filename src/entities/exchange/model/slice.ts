import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@app/store/store";
import { api } from "@shared/api/api";
import type { Exchange, CreateExchangeRequest } from "../types";

interface ExchangeState {
  currentExchange: Exchange | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ExchangeState = {
  currentExchange: null,
  isLoading: false,
  error: null,
};

export const createExchange = createAsyncThunk<
  Exchange,
  CreateExchangeRequest,
  { rejectValue: string }
>("exchange/create", async (data, { rejectWithValue }) => {
  try {
    const exchange = await api.createExchange(data);
    return exchange;
  } catch (error: any) {
    return rejectWithValue(
      error?.message || "Ошибка при создании запроса на обмен",
    );
  }
});

export const getExchangeStatus = createAsyncThunk<
  { status: string; message: string; updatedAt: string },
  number,
  { rejectValue: string }
>("exchange/getStatus", async (exchangeId, { rejectWithValue }) => {
  try {
    const status = await api.getExchangeStatus(exchangeId);
    return status;
  } catch (error: any) {
    return rejectWithValue(
      error?.message || "Ошибка при получении статуса обмена",
    );
  }
});

export const getExchange = createAsyncThunk<
  Exchange,
  number,
  { rejectValue: string }
>("exchange/get", async (exchangeId, { rejectWithValue }) => {
  try {
    const exchange = await api.getExchange(exchangeId);
    return exchange;
  } catch (error: any) {
    return rejectWithValue(
      error?.message || "Ошибка при получении информации об обмене",
    );
  }
});

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    clearExchange: (state) => {
      state.currentExchange = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createExchange
      .addCase(createExchange.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createExchange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentExchange = action.payload;
      })
      .addCase(createExchange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при создании запроса на обмен";
      })
      // getExchangeStatus
      .addCase(getExchangeStatus.fulfilled, (state, action) => {
        if (state.currentExchange) {
          state.currentExchange.status = action.payload.status as any;
          state.currentExchange.updatedAt = action.payload.updatedAt;
        }
      })
      // getExchange
      .addCase(getExchange.fulfilled, (state, action) => {
        state.currentExchange = action.payload;
      });
  },
});

export const { clearExchange } = exchangeSlice.actions;

// Селекторы
export const selectCurrentExchange = (state: RootState) =>
  state.exchange.currentExchange;
export const selectExchangeLoading = (state: RootState) =>
  state.exchange.isLoading;
export const selectExchangeError = (state: RootState) => state.exchange.error;

export const exchangeReducer = exchangeSlice.reducer;
