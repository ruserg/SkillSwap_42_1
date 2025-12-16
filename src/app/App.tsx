import { Suspense, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchUser, selectAuth } from "@features/auth/model/slice";
import { getCookie } from "@shared/lib/cookies";
import { AppRoutes } from "./Routes";
import { BrowserRouter } from "react-router-dom";
import {
  fetchNotifications,
  fetchToastNotification,
} from "@entities/notification/model/slice";
import { fetchCategories } from "@/entities/category/model/slice";
import { fetchCities } from "@/entities/city/model/slice";
import { fetchUsersData } from "@/entities/user/model/slice";
import { fetchSkillsData } from "@/entities/skill/model/slice";
import { Loader } from "@/shared/ui/Loader/Loader";

export const App = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(selectAuth);
  const isAuth = Boolean(user);
  const hasToken = !!getCookie("accessToken");

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        dispatch(fetchCategories()),
        dispatch(fetchCities()),
        dispatch(fetchUsersData()),
        dispatch(fetchSkillsData()),
      ]);
    };

    loadInitialData();
  }, [dispatch]);

  useEffect(() => {
    if (hasToken && !user && !isLoading) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, hasToken, isLoading]);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchNotifications());
      dispatch(fetchToastNotification());

      const toastInterval = setInterval(() => {
        dispatch(fetchToastNotification());
      }, 60 * 1000);

      // Периодическая загрузка уведомлений каждые 30 секунд для обновления счетчика
      const notificationsInterval = setInterval(() => {
        dispatch(fetchNotifications());
      }, 30 * 1000);

      return () => {
        clearInterval(toastInterval);
        clearInterval(notificationsInterval);
      };
    }
  }, [isAuth, dispatch]);

  if (hasToken && !user) {
    return null;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
};
