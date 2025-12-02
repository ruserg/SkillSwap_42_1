import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

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

export default signupSlice.reducer;
