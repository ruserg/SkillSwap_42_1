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
  const { user } = useAppSelector(selectAuth);
  const isAuth = Boolean(user);

  useEffect(() => {
    // При монтировании приложения проверяем наличие токена
    // Если токен есть, но пользователь не загружен, загружаем его
    const accessToken = getCookie("accessToken");
    if (accessToken && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  // Загружаем уведомления и тосты при авторизации
  useEffect(() => {
    if (isAuth) {
      // Первая загрузка сразу
      dispatch(fetchNotifications());
      dispatch(fetchToastNotification());

      // Периодическая проверка тостов каждую минуту
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

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
