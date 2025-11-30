import { Routes, Route } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./ProtectedRoute";
import { MainPage } from "@pages/main-page/main-page.tsx";
//основные страницы приложения - заглушки
//после создания pages отсюда надо будет удалять
//
// function Home() {
//   return (
//     <section>
//       <h2>Главная</h2>
//       <p>Здесь будут предложения для обмена навыками</p>
//     </section>
//   );
// }

function Login() {
  return (
    <section>
      <h2>Вход</h2>
      <p>Форма входа в аккаунт</p>
    </section>
  );
}

function RegistrationStep1() {
  return (
    <section>
      <h2>Регистрация - Шаг 1</h2>
      <p>Основные данные аккаунта</p>
    </section>
  );
}

function RegistrationStep2() {
  return (
    <section>
      <h2>Регистрация - Шаг 2</h2>
      <p>Личная информация</p>
    </section>
  );
}

function RegistrationStep3() {
  return (
    <section>
      <h2>Регистрация - Шаг 3</h2>
      <p>Добавление навыка</p>
    </section>
  );
}

function CreateOffer() {
  return (
    <section>
      <h2>Предложить обмен</h2>
      <p>Форма создания нового предложения обмена</p>
    </section>
  );
}

function Favorites() {
  return (
    <section>
      <h2>Избранное</h2>
      <p>Сохраненные предложения</p>
    </section>
  );
}

function Profile() {
  return (
    <section>
      <h2>Личный кабинет</h2>
      <p>Настройки профиля и личные данные</p>
    </section>
  );
}

function NotFound() {
  return (
    <section>
      <h2>404 — Страница не найдена</h2>
      <p>К сожалению, эта страница недоступна.</p>
    </section>
  );
}

function ServerError() {
  return (
    <section>
      <h2>500 — Ошибка сервера</h2>
      <p>На сервере произошла ошибка</p>
    </section>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        {/* домашняя страница */}
        <Route index element={<MainPage />} />
        {/* публичные роуты, нужно ли оборачивать их в PublicRoute? */}
        <Route path="login" element={<Login />} />
        <Route path="registration/step1" element={<RegistrationStep1 />} />
        <Route path="registration/step2" element={<RegistrationStep2 />} />
        <Route path="registration/step3" element={<RegistrationStep3 />} />

        {/* защищенные роуты */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <Favorites />
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
        {/* ошибки */}
        <Route path="500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
