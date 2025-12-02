import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./slices/exampleSlice";
import signupReducer from "./slices/signupSlice";
import usersDataReducer from "./slices/usersDataSlice";
import referenceDataReducer from "./slices/referenceDataSlice";
import skillsDataReducer from "./slices/skillsDataSlice";

const store = configureStore({
  reducer: {
    example: exampleReducer,
    signup: signupReducer,
    usersData: usersDataReducer,
    referenceData: referenceDataReducer,
    skillsData: skillsDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
