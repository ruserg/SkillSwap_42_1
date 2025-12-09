import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import { selectAuth } from "@features/auth/model/slice";
import { getCookie } from "@shared/lib/cookies";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAppSelector(selectAuth);
  const hasToken = !!getCookie("accessToken");
  const location = useLocation();

  // Если нет токена или пользователя, редиректим на логин
  // Проверка загрузки пользователя уже происходит в App.tsx
  if (!hasToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
