import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainPage } from "@pages/MainPage/MainPage";
import { SignupStepOne } from "@pages/signup/ui/SignupStepOne/SignupStepOne";
import { SignupStepThree } from "@pages/signup/ui/SignupStepThree/SignupStepThree";
import { SignupStepTwo } from "@pages/signup/ui/SignupStepTwo/SignupStepTwo";
import { Login } from "@/pages/Login/Login";
import UserPage from "@/pages/UserPage/UserPage";
import { Layout } from "@/widgets/Layout/Layout";
import { ErrorPage } from "@/pages/ErrorPage/ErrorPage";
import { ProfilePage } from "@/pages/ProfilePage/ProfilePage";
import { FavoritesPage } from "@/pages/FavoritesPage/FavoritesPage";

function CreateOffer() {
  return (
    <section>
      <h2>Предложить обмен</h2>
      <p>Форма создания нового предложения обмена</p>
    </section>
  );
}

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<MainPage />} />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="favorites"
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="create-offer"
        element={
          <ProtectedRoute>
            <CreateOffer />
          </ProtectedRoute>
        }
      />
      <Route
        path="user/:userId"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />
      <Route path="500" element={<ErrorPage statusCode="500" />} />
      <Route path="*" element={<ErrorPage statusCode="404" />} />
    </Route>
    <Route
      path="login"
      element={
        <ProtectedRoute requireAuth={false}>
          <Login />
        </ProtectedRoute>
      }
    />
    <Route path="registration">
      <Route
        index
        element={
          <ProtectedRoute requireAuth={false}>
            <Navigate to="step1" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="step1"
        element={
          <ProtectedRoute requireAuth={false}>
            <SignupStepOne />
          </ProtectedRoute>
        }
      />
      <Route path="step2" element={<SignupStepTwo />} />
      <Route path="step3" element={<SignupStepThree />} />
    </Route>
  </Routes>
);
