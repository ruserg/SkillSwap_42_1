import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainPage } from "@pages/MainPage/MainPage";
import { Layout } from "@/widgets/Layout/Layout";
import { ErrorPage } from "@/pages/ErrorPage/ErrorPage";
import { lazy } from "react";

function CreateOffer() {
  return (
    <section>
      <h2>Предложить обмен</h2>
      <p>Форма создания нового предложения обмена</p>
    </section>
  );
}

const lazyNamed = <T extends React.ComponentType<any>>(
  loader: () => Promise<{ [key: string]: T }>,
  exportName: string,
) => lazy(() => loader().then((module) => ({ default: module[exportName] })));

const UserPage = lazyNamed(
  () => import("@pages/UserPage/UserPage"),
  "UserPage",
);
const ProfilePage = lazyNamed(
  () => import("@pages/ProfilePage/ProfilePage"),
  "ProfilePage",
);
const FavoritesPage = lazyNamed(
  () => import("@pages/FavoritesPage/FavoritesPage"),
  "FavoritesPage",
);
const MySkillsPage = lazyNamed(
  () => import("@pages/MySkills/mySkillsPage"),
  "MySkillsPage",
);
const SkillEditPage = lazyNamed(
  () => import("@pages/SkillEdit/skillEditPage"),
  "SkillEditPage",
);
const Login = lazyNamed(() => import("@pages/Login/Login"), "Login");
const SignupStepOne = lazyNamed(
  () => import("@pages/signup/ui/SignupStepOne/SignupStepOne"),
  "SignupStepOne",
);
const SignupStepTwo = lazyNamed(
  () => import("@pages/signup/ui/SignupStepTwo/SignupStepTwo"),
  "SignupStepTwo",
);
const SignupStepThree = lazyNamed(
  () => import("@pages/signup/ui/SignupStepThree/SignupStepThree"),
  "SignupStepThree",
);
const ExchangesPage = lazyNamed(
  () => import("@pages/ExchangesPage/ExchangesPage"),
  "ExchangesPage",
);
const RequestsPage = lazyNamed(
  () => import("@pages/RequestsPage/RequestsPage"),
  "RequestsPage",
);

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
        path="skills"
        element={
          <ProtectedRoute>
            <MySkillsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="skills/create"
        element={
          <ProtectedRoute>
            <SkillEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile/skills/edit/:skillId"
        element={
          <ProtectedRoute>
            <SkillEditPage />
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
        path="exchanges"
        element={
          <ProtectedRoute>
            <ExchangesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="requests"
        element={
          <ProtectedRoute>
            <RequestsPage />
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
