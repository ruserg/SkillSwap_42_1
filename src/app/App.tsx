import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchUser, selectAuth } from "@features/auth/model/slice";
import { getCookie } from "@shared/lib/cookies";
import { AppRoutes } from "./Routes";
import { BrowserRouter } from "react-router-dom";
import {
  fetchNotifications,
  fetchToastNotification,
} from "@entities/notification/model/slice";

export const App = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(selectAuth);
  const isAuth = Boolean(user);
  const hasToken = !!getCookie("accessToken");

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
      <AppRoutes />
    </BrowserRouter>
  );
};
