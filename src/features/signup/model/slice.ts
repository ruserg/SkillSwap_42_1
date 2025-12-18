import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@app/store/store";
import { register } from "@features/auth/model/slice";
import type { AppDispatch } from "@app/store/store";
import { api } from "@shared/api/api";
import { fetchCategories } from "@entities/category/model/slice";

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

export const getAvatarFile = (): File | null => avatarFileStorage;
export const setAvatarFile = (file: File | null) => {
  avatarFileStorage = file;
};
export const clearAvatarFile = () => {
  avatarFileStorage = null;
};

const getInitialState = (): SignupState => {
  try {
    const savedStep1 = localStorage.getItem("signupStep1Data");
    const savedStep2 = localStorage.getItem("signupStep2Data");

    let step1Data = { email: "", password: "" };
    let step2Data = {
      firstName: "",
      location: "",
      dateOfBirth: "",
      gender: "",
      avatar: "",
      learnCategory: [],
      learnSubcategory: [],
    };

    if (savedStep1) {
      const parsed = JSON.parse(savedStep1);
      if (parsed && typeof parsed === "object") {
        step1Data = { ...step1Data, ...parsed };
      }
    }

    if (savedStep2) {
      const parsed = JSON.parse(savedStep2);
      if (parsed && typeof parsed === "object") {
        step2Data = { ...step2Data, ...parsed };

        // ФАЙЛ АВАТАРА ИЗ BASE64
        if (
          parsed.avatar &&
          typeof parsed.avatar === "string" &&
          parsed.avatar.startsWith("data:image")
        ) {
          try {
            const byteString = atob(parsed.avatar.split(",")[1]);
            const mimeString = parsed.avatar
              .split(",")[0]
              .split(":")[1]
              .split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([ab], { type: mimeString });
            const file = new File([blob], "avatar.jpg", { type: mimeString });

            avatarFileStorage = file;
          } catch (error) {
            console.error(
              "[signup] Ошибка восстановления аватара из base64:",
              error,
            );
            avatarFileStorage = null;
          }
        } else {
          avatarFileStorage = null;
        }
      }
    }

    return {
      step1: step1Data,
      step2: step2Data,
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
    };
  } catch (error) {
    console.error("[signup] Ошибка загрузки из localStorage:", error);
    return {
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
    };
  }
};

const initialState: SignupState = getInitialState();

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
      avatar: avatarFile,
      ...(state.step2.dateOfBirth && { dateOfBirth: state.step2.dateOfBirth }),
      gender: genderValue,
      cityId: parseInt(state.step2.location, 10),
    };

    // @ts-ignore - игнорируем ошибку типов для dispatch
    await dispatch(register(registerData)).unwrap();

    // После успешной регистрации создаем навыки "want to learn" для выбранных подкатегорий
    if (state.step2.learnSubcategory.length > 0) {
      await dispatch(createWantToLearnSkills()).unwrap();
    }

    return;
  } catch (error: any) {
    console.error("Ошибка регистрации:", error);
    return rejectWithValue(
      error?.response?.data?.message || error?.message || "Ошибка регистрации",
    );
  }
});

// Создание навыков "want to learn" (шаг 2) - после регистрации пользователя
export const createWantToLearnSkills = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>(
  "signup/createWantToLearnSkills",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState().signup;
      let categoryState = getState().categoryData;

      if (categoryState.subcategories.length === 0) {
        await dispatch(fetchCategories()).unwrap();
        categoryState = getState().categoryData;
      }

      // Создание навыков "want to learn" для выбранных подкатегорий
      if (state.step2.learnSubcategory.length > 0) {
        const skillPromises = state.step2.learnSubcategory
          .map((subcatIdStr) => {
            const subcategoryId = parseInt(subcatIdStr, 10);
            if (isNaN(subcategoryId)) {
              console.warn(
                `[createWantToLearnSkills] Invalid subcategory ID: ${subcatIdStr}, skipping`,
              );
              return null;
            }

            const subcategory = categoryState.subcategories.find(
              (sub) => sub.id === subcategoryId,
            );

            if (!subcategory) {
              console.warn(
                `[createWantToLearnSkills] Subcategory with ID ${subcategoryId} not found, skipping`,
              );
              return null;
            }

            // Создаем навык с типом "request" (want to learn)
            return api.createSkill({
              subcategoryId,
              title: subcategory.name, // Используем название подкатегории как title
              description: "", // Описание можно оставить пустым или добавить позже
              type_of_proposal: "request" as const,
            });
          })
          .filter((promise): promise is Promise<any> => promise !== null);

        if (skillPromises.length > 0) {
          await Promise.all(skillPromises);
        }
      }

      return;
    } catch (error: any) {
      console.error("Ошибка создания навыков 'want to learn':", error);
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Ошибка создания навыков 'want to learn'",
      );
    }
  },
);

// Создание навыков (шаг 3)
export const createSkills = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>("signup/createSkills", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState().signup;

    // Создание навыков (шаг 3) - регистрация уже выполнена на шаге 2
    if (state.step3.skillName && state.step3.teachSubcategory.length > 0) {
      const skillPromises = state.step3.teachSubcategory
        .map((subcatId) => {
          const subcategoryId = parseInt(subcatId, 10);
          if (!isNaN(subcategoryId)) {
            return api.createSkill({
              subcategoryId,
              title: state.step3.skillName,
              description: state.step3.description || "",
              type_of_proposal: "offer" as const,
              images: state.step3.images.length > 0 ? state.step3.images : [],
            });
          }
          return null;
        })
        .filter((promise): promise is Promise<any> => promise !== null);

      if (skillPromises.length > 0) {
        await Promise.all(skillPromises);
      }
    }

    return;
  } catch (error: any) {
    console.error("Ошибка создания навыков:", error);
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Ошибка создания навыков",
    );
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
      if (action.payload >= 0 && action.payload < state.step3.images.length) {
        state.step3.images.splice(action.payload, 1);
      }
    },

    // Очистка
    clearSignupData: (state) => {
      Object.assign(state, getInitialState());
      clearAvatarFile();
      localStorage.removeItem("signupStep1Data");
      localStorage.removeItem("signupStep2Data");
    },
  },
  extraReducers: (builder) => {
    builder
      // createSkills (шаг 3)
      .addCase(createSkills.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(createSkills.fulfilled, (state) => {
        state.isSubmitting = false;
        state.submitError = null;
      })
      .addCase(createSkills.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload as string;
      })
      // createWantToLearnSkills (часть шага 2)
      .addCase(createWantToLearnSkills.pending, (state) => {
        // Не меняем флаги регистрации, только флаг отправки
        state.isSubmitting = true;
      })
      .addCase(createWantToLearnSkills.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(createWantToLearnSkills.rejected, (state, action) => {
        state.isSubmitting = false;
        // Логируем ошибку, но не блокируем переход на шаг 3
        console.error(
          "[createWantToLearnSkills] Ошибка создания навыков 'want to learn':",
          action.payload,
        );
      })
      // registerUserAfterStep2
      .addCase(registerUserAfterStep2.pending, (state) => {
        state.isRegistering = true;
        state.registerError = null;
      })
      .addCase(registerUserAfterStep2.fulfilled, (state) => {
        state.isRegistering = false;
        state.registerError = null;
        // ОЧИЩАЕМ localStorage при успешной регистрации
        try {
          localStorage.removeItem("signupStep1Data");
          localStorage.removeItem("signupStep2Data");
        } catch (error) {
          console.error("[signup] Ошибка очистки localStorage:", error);
        }
      })
      .addCase(registerUserAfterStep2.rejected, (state, action) => {
        state.isRegistering = false;
        state.registerError = action.payload as string;
      })

      // Сохраняем шаг 1
      .addMatcher(
        (action) => action.type === "signup/updateStep1",
        (state) => {
          try {
            localStorage.setItem(
              "signupStep1Data",
              JSON.stringify(state.step1),
            );
          } catch (error) {
            console.error("[signup] Ошибка сохранения шага 1:", error);
          }
        },
      )

      // Сохраняем шаг 2
      .addMatcher(
        (action) =>
          [
            "signup/updateFirstName",
            "signup/updateCity",
            "signup/updateGender",
            "signup/updateDateOfBirth",
            "signup/updateAvatar",
            "signup/setLearnCategories",
            "signup/setLearnSubcategories",
          ].includes(action.type),
        (state) => {
          try {
            localStorage.setItem(
              "signupStep2Data",
              JSON.stringify(state.step2),
            );
          } catch (error) {
            console.error("[signup] Ошибка сохранения шага 2:", error);
          }
        },
      );
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
