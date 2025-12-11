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
    location: string;
    dateOfBirth: string;
    gender: string;
    avatar: string;
    learnCategory: string[];
    learnSubcategory: string[];
  };
  step3: {
    skillName: string;
    teachCategory: string[];
    teachSubcategory: string[];
    description: string;
    images: string[];
  };
  isSubmitting: boolean;
  submitError: string | null;
  isRegistering: boolean;
  registerError: string | null;
}

let avatarFileStorage: File | null = null;

// Функции для работы с аватаром
export const getAvatarFile = (): File | null => avatarFileStorage;
export const setAvatarFile = (file: File | null) => {
  avatarFileStorage = file;
};
export const clearAvatarFile = () => {
  avatarFileStorage = null;
};

const getInitialState = (): SignupState => ({
  step1: { email: "", password: "" },
  step2: {
    firstName: "",
    location: "",
    dateOfBirth: "",
    gender: "",
    avatar: "",
    learnCategory: [],
    learnSubcategory: [],
  },
  step3: {
    skillName: "",
    teachCategory: [],
    teachSubcategory: [],
    description: "",
    images: [],
  },
  isSubmitting: false,
  submitError: null,
  isRegistering: false,
  registerError: null,
});

const initialState: SignupState = getInitialState();

// Регистрация пользователя после второго шага
export const registerUserAfterStep2 = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>("signup/registerUser", async (_, { dispatch, getState, rejectWithValue }) => {
  try {
    const state = getState().signup;

    // Базовая валидация
    if (!state.step1.email || !state.step1.password) {
      return rejectWithValue("Email и пароль обязательны");
    }
    if (!state.step2.firstName) {
      return rejectWithValue("Имя обязательно");
    }
    if (!state.step2.location) {
      return rejectWithValue("Город обязателен");
    }

    const avatarFile = getAvatarFile();

    // Бэкенд требует аватар, проверяем что он загружен
    if (!avatarFile) {
      return rejectWithValue("Аватар обязателен для загрузки");
    }

    let genderValue: "M" | "F" | undefined;
    if (state.step2.gender === "Мужской") genderValue = "M";
    if (state.step2.gender === "Женский") genderValue = "F";

    // Бэкенд требует gender, проверяем что он выбран
    if (!genderValue) {
      return rejectWithValue("Пол обязателен");
    }

    const registerData = {
      email: state.step1.email,
      password: state.step1.password,
      name: state.step2.firstName.trim(),
      ...(avatarFile && { avatar: avatarFile }),
      ...(state.step2.dateOfBirth && { dateOfBirth: state.step2.dateOfBirth }),
      ...(genderValue && { gender: genderValue }),
      ...(state.step2.location && {
        cityId: parseInt(state.step2.location, 10),
      }),
      ...(state.step2.learnSubcategory.length > 0 && {
        desiredCategories: state.step2.learnSubcategory.map((id) =>
          parseInt(id, 10),
        ),
      }),
    };

    // @ts-ignore
    await dispatch(register(registerData)).unwrap();

    return;
  } catch (error: any) {
    console.error("Ошибка регистрации:", error);
    return rejectWithValue(error?.message || "Ошибка регистрации");
  }
});

export const createSkills = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>("signup/createSkills", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState().signup;

    // Создание навыков (шаг 3) - регистрация уже выполнена на шаге 2
    if (state.step3.skillName && state.step3.teachSubcategory.length > 0) {
      const skillPromises = state.step3.teachSubcategory.map(
        async (subcatId) => {
          const subcategoryId = parseInt(subcatId, 10);
          if (!isNaN(subcategoryId)) {
            return api.createSkill({
              subcategoryId,
              title: state.step3.skillName,
              description: state.step3.description || "",
              type_of_proposal: "offer" as const,
              ...(state.step3.images.length > 0 && {
                images: state.step3.images,
              }),
            });
          }
        },
      );
      await Promise.all(skillPromises);
    }

    return;
  } catch (error: any) {
    console.error("Ошибка создания навыков:", error);
    return rejectWithValue(error?.message || "Ошибка создания навыков");
  }
});

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    // Шаг 1
    updateStep1: (
      state,
      action: PayloadAction<Partial<SignupState["step1"]>>,
    ) => {
      state.step1 = { ...state.step1, ...action.payload };
    },

    // Шаг 2
    updateStep2: (
      state,
      action: PayloadAction<Partial<SignupState["step2"]>>,
    ) => {
      state.step2 = { ...state.step2, ...action.payload };
    },

    updateFirstName: (state, action: PayloadAction<string>) => {
      state.step2.firstName = action.payload;
    },

    updateCity: (state, action: PayloadAction<string>) => {
      state.step2.location = action.payload;
    },

    updateGender: (state, action: PayloadAction<string>) => {
      state.step2.gender = action.payload;
    },

    updateDateOfBirth: (state, action: PayloadAction<string>) => {
      state.step2.dateOfBirth = action.payload;
    },

    updateAvatar: (state, action: PayloadAction<string>) => {
      state.step2.avatar = action.payload;
    },

    clearAvatar: (state) => {
      state.step2.avatar = "";
      clearAvatarFile();
    },

    setLearnCategories: (state, action: PayloadAction<string[]>) => {
      state.step2.learnCategory = action.payload;
    },

    setLearnSubcategories: (state, action: PayloadAction<string[]>) => {
      state.step2.learnSubcategory = action.payload;
    },

    // Шаг 3
    updateStep3: (
      state,
      action: PayloadAction<Partial<SignupState["step3"]>>,
    ) => {
      state.step3 = { ...state.step3, ...action.payload };
    },

    setCategories: (state, action: PayloadAction<string[]>) => {
      state.step3.teachCategory = action.payload;
    },

    setSubcategories: (state, action: PayloadAction<string[]>) => {
      state.step3.teachSubcategory = action.payload;
    },

    addImage: (state, action: PayloadAction<string>) => {
      state.step3.images.push(action.payload);
    },

    removeImage: (state, action: PayloadAction<number>) => {
      state.step3.images.splice(action.payload, 1);
    },

    // Очистка
    clearSignupData: (state) => {
      Object.assign(state, getInitialState());
      clearAvatarFile();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSkills.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(createSkills.fulfilled, (state) => {
        state.isSubmitting = false;
        Object.assign(state, getInitialState());
        clearAvatarFile();
      })
      .addCase(createSkills.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload as string;
      })
      // registerUserAfterStep2
      .addCase(registerUserAfterStep2.pending, (state) => {
        state.isRegistering = true;
        state.registerError = null;
      })
      .addCase(registerUserAfterStep2.fulfilled, (state) => {
        state.isRegistering = false;
        state.registerError = null;
      })
      .addCase(registerUserAfterStep2.rejected, (state, action) => {
        state.isRegistering = false;
        state.registerError = action.payload as string;
      });
  },
});

export const {
  updateStep1,
  updateStep2,
  updateStep3,
  updateFirstName,
  updateCity,
  updateGender,
  updateDateOfBirth,
  updateAvatar,
  clearAvatar,
  setCategories,
  setSubcategories,
  setLearnCategories,
  setLearnSubcategories,
  addImage,
  removeImage,
  clearSignupData,
} = signupSlice.actions;

// Селекторы
export const selectSignup = (state: RootState) => state.signup;
export const selectIsSubmitting = (state: RootState) =>
  state.signup.isSubmitting;
export const selectSubmitError = (state: RootState) => state.signup.submitError;
export const selectIsRegistering = (state: RootState) =>
  state.signup.isRegistering;
export const selectRegisterError = (state: RootState) =>
  state.signup.registerError;

// Селекторы для шага 2
export const selectFirstName = (state: RootState) =>
  state.signup.step2.firstName;
export const selectLocation = (state: RootState) => state.signup.step2.location;
export const selectGender = (state: RootState) => state.signup.step2.gender;
export const selectDateOfBirth = (state: RootState) =>
  state.signup.step2.dateOfBirth;
export const selectAvatar = (state: RootState) => state.signup.step2.avatar;
export const selectLearnCategories = (state: RootState) =>
  state.signup.step2.learnCategory;
export const selectLearnSubcategories = (state: RootState) =>
  state.signup.step2.learnSubcategory;

// Селекторы для шага 3
export const selectTeachCategories = (state: RootState) =>
  state.signup.step3.teachCategory;
export const selectTeachSubcategories = (state: RootState) =>
  state.signup.step3.teachSubcategory;
export const selectStep3Images = (state: RootState) =>
  state.signup.step3.images;
export const selectStep3Data = (state: RootState) => state.signup.step3;
export const signupReducer = signupSlice.reducer;
