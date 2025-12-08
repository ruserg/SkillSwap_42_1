import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchUser, selectAuth } from "@features/auth/model/slice";
import { getCookie } from "@shared/lib/cookies";
import { useNotificationsLogger } from "@shared/hooks/useNotificationsLogger";

export default function App() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);

  // Логирование уведомлений каждую минуту
  useNotificationsLogger();

  useEffect(() => {
    // При монтировании приложения проверяем наличие токена
    // Если токен есть, но пользователь не загружен, загружаем его
    const accessToken = getCookie("accessToken");
    if (accessToken && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  return (
    <>
      <Outlet />
    </>
  );
}
