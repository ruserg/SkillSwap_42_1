import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import { selectAuth } from "@features/auth/model/slice";
import { getCookie } from "@shared/lib/cookies";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Если true (по умолчанию) - требует авторизации, редиректит незалогиненных на /login
   * Если false - требует отсутствия авторизации, редиректит залогиненных на главную
   */
  requireAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { user } = useAppSelector(selectAuth);
  const hasToken = !!getCookie("accessToken");
  const location = useLocation();

  if (requireAuth) {
    if (!hasToken || !user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } else {
    if (hasToken && user) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
