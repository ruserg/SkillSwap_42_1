import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@app/store/store";
import { register } from "@features/auth/model/slice";
import type { AppDispatch } from "@app/store/store";
import { api } from "@shared/api/api";

interface SignupState {
  step1: {
    email: string;
    password: string;
  };
  step2: {
    firstName: string;
    lastName: string;
    location: string;
    dateOfBirth: string;
    gender: string;
    avatar: File | null; // обязательный файл аватара
  };
  step3: {
    skillName: string;
    category: string;
    categoryName?: string;
    subcategory: string;
    subcategoryName?: string;
    description: string;
    images: string[];
  };
  isSubmitting: boolean;
  submitError: string | null;
}

// Функция для загрузки состояния из localStorage
const loadStateFromStorage = (): SignupState => {
  try {
    const serializedState = localStorage.getItem("signupState");
    if (serializedState === null) {
      return getInitialState();
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Ошибка при загрузке состояния из localStorage:", err);
    return getInitialState();
  }
};

// Функция для получения начального состояния
const getInitialState = (): SignupState => ({
  step1: {
    email: "",
    password: "",
  },
  step2: {
    firstName: "",
    lastName: "",
    location: "",
    dateOfBirth: "",
    gender: "",
    avatar: null,
  },
  step3: {
    skillName: "",
    category: "",
    categoryName: "",
    subcategory: "",
    subcategoryName: "",
    description: "",
    images: [],
  },
  isSubmitting: false,
  submitError: null,
});

// Функция для сохранения состояния в localStorage
export const saveStateToStorage = (state: SignupState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("signupState", serializedState);
  } catch (err) {
    console.error("Ошибка при сохранении состояния в localStorage:", err);
  }
};

const initialState: SignupState = loadStateFromStorage();

// Thunk для финальной отправки регистрации
export const submitSignup = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>("signup/submit", async (_, { dispatch, getState, rejectWithValue }) => {
  try {
    const state = getState().signup;

    // Валидация обязательных полей
    if (!state.step1.email || !state.step1.password) {
      return rejectWithValue("Email и пароль обязательны");
    }

    if (!state.step2.firstName) {
      return rejectWithValue("Имя обязательно");
    }

    // Валидация обязательных полей
    if (!state.step2.avatar) {
      return rejectWithValue("Аватар обязателен для регистрации");
    }

    // Формируем данные для регистрации
    const genderMap: Record<string, "M" | "F"> = {
      Мужской: "M",
      Женский: "F",
    };

    const registerData: import("@shared/lib/types/api").RegisterRequest = {
      email: state.step1.email,
      password: state.step1.password,
      name:
        `${state.step2.firstName} ${state.step2.lastName}`.trim() ||
        state.step2.firstName,
      avatar: state.step2.avatar,
      firstName: state.step2.firstName || undefined,
      lastName: state.step2.lastName || undefined,
      dateOfBirth: state.step2.dateOfBirth || undefined,
      gender: state.step2.gender
        ? (genderMap[state.step2.gender] as "M" | "F")
        : undefined,
      cityId: state.step2.location
        ? parseInt(state.step2.location, 10)
        : undefined,
    };

    // 1. Регистрация пользователя (все данные из step1 и step2 передаются сразу)
    await dispatch(register(registerData)).unwrap();

    // 2. Создание навыка из step3 (если заполнено)
    if (state.step3.skillName && state.step3.subcategory) {
      const subcategoryId = parseInt(state.step3.subcategory, 10);
      if (!isNaN(subcategoryId)) {
        await api.createSkill({
          subcategoryId,
          title: state.step3.skillName,
          description: state.step3.description || "",
          type_of_proposal: "offer", // По умолчанию "учу" (предложение)
          images:
            state.step3.images.length > 0 ? state.step3.images : undefined,
        });
      }
    }

    return;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Ошибка регистрации",
    );
  }
});

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    updateStep1: (
      state,
      action: PayloadAction<Partial<SignupState["step1"]>>,
    ) => {
      state.step1 = { ...state.step1, ...action.payload };
      // Сохраняем в localStorage после обновления
      saveStateToStorage(state);
    },
    updateStep2: (
      state,
      action: PayloadAction<Partial<SignupState["step2"]>>,
    ) => {
      state.step2 = { ...state.step2, ...action.payload };
      // Сохраняем в localStorage после обновления
      saveStateToStorage(state);
    },
    updateStep3: (
      state,
      action: PayloadAction<Partial<SignupState["step3"]>>,
    ) => {
      state.step3 = { ...state.step3, ...action.payload };
      // Сохраняем в localStorage после обновления
      saveStateToStorage(state);
    },
    addImage: (state, action: PayloadAction<string>) => {
      state.step3.images.push(action.payload);
      // Сохраняем в localStorage после обновления
      saveStateToStorage(state);
    },
    removeImage: (state, action: PayloadAction<number>) => {
      state.step3.images.splice(action.payload, 1);
      // Сохраняем в localStorage после обновления
      saveStateToStorage(state);
    },
    clearSignupData: (state) => {
      Object.assign(state, getInitialState());
      // Удаляем из localStorage
      localStorage.removeItem("signupState");
    },
    // Новый action для явного сохранения всего состояния
    saveSignupState: (state) => {
      saveStateToStorage(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSignup.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(submitSignup.fulfilled, (state) => {
        state.isSubmitting = false;
        state.submitError = null;
        // Очищаем данные после успешной регистрации
        Object.assign(state, getInitialState());
        localStorage.removeItem("signupState");
      })
      .addCase(submitSignup.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload as string;
      });
  },
});

export const {
  updateStep1,
  updateStep2,
  updateStep3,
  addImage,
  removeImage,
  clearSignupData,
  saveSignupState,
} = signupSlice.actions;

export const selectSignup = (state: RootState) => state.signup;
export const selectIsSubmitting = (state: RootState) =>
  state.signup.isSubmitting;
export const selectSubmitError = (state: RootState) => state.signup.submitError;

export const signupReducer = signupSlice.reducer;
