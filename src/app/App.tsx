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

  // При монтировании приложения проверяем наличие токена
  // Если токен есть, но пользователь не загружен, загружаем его
  useEffect(() => {
    if (hasToken && !user && !isLoading) {
      dispatch(fetchUser());
    }
  }, [dispatch, user, hasToken, isLoading]);

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

  // Если есть токен, но пользователь еще не загружен, ждем
  // Это предотвращает редиректы во время загрузки пользователя
  if (hasToken && !user) {
    return null; // или можно показать лоадер
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
