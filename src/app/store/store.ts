import { configureStore } from "@reduxjs/toolkit";
import { usersDataReducer } from "@entities/user/model/slice";
import { skillsDataReducer } from "@entities/skill/model/slice";
import { likesReducer } from "@entities/like/model/slice";
import { categoryDataReducer } from "@entities/category/model/slice";
import { citiesReducer } from "@entities/city/model/slice";
import { notificationsReducer } from "@entities/notification/model/slice";
import { authReducer } from "@features/auth/model/slice";
import { signupReducer } from "@features/signup/model/slice";
const store = configureStore({
  reducer: {
    signup: signupReducer,
    usersData: usersDataReducer,
    categoryData: categoryDataReducer,
    cities: citiesReducer,
    skillsData: skillsDataReducer,
    likes: likesReducer,
    notifications: notificationsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
