import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainPage } from "@pages/MainPage/MainPage";
import { Layout } from "@/widgets/Layout/Layout";
import { ErrorPage } from "@/pages/ErrorPage/ErrorPage";
import { UnderConstructionPage } from "@/pages/UnderConstructionPage/UnderConstructionPage";
import { lazy } from "react";
import { PageMeta } from "@/shared/ui/PageMeta/PageMeta";
import { LayoutUserPage } from "@/widgets/LayoutUserPage/LayoutUserPage";

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
      <Route
        index
        element={
          <PageMeta
            title="Обмен навыками"
            description="SkillSwap — уникальная платформа для взаимного обучения. Обменивайтесь знаниями, находите менторов и единомышленников. Развивайте навыки бесплатно через взаимопомощь."
            ogTitle="SkillSwap — обмен навыками и взаимное обучение"
            ogDescription="Присоединяйтесь к сообществу SkillSwap! Бесплатно обучайтесь у других и делитесь своими знаниями. Находите менторов и единомышленников."
          >
            <MainPage />
          </PageMeta>
        }
      />
      <Route path="profile" element={<LayoutUserPage />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <PageMeta
                title="Личный кабинет"
                description="Управляйте вашим профилем на SkillSwap: редактируйте информацию, просматривайте статистику, управляйте уведомлениями и настройками приватности."
                ogTitle="Личный кабинет SkillSwap — управление профилем"
                ogDescription="Настройте свой профиль на платформе обмена навыками SkillSwap. Станьте заметным для сообщества и находите идеальных партнеров для обучения."
              >
                <ProfilePage />
              </PageMeta>
            </ProtectedRoute>
          }
        />
        <Route path="skills">
          <Route
            index
            element={
              <ProtectedRoute>
                <PageMeta
                  title="Мои навыки"
                  description="Просматривайте и управляйте вашими навыками на SkillSwap. Добавляйте новые умения, редактируйте описания, указывайте уровень владения и доступность для обмена."
                  ogTitle="Мои навыки на SkillSwap — ваш вклад в сообщество"
                  ogDescription="Покажите свои навыки сообществу SkillSwap! Опишите свои умения подробно и найдите тех, кто хочет научиться у вас. Взаимный обмен знаниями."
                >
                  <MySkillsPage />
                </PageMeta>
              </ProtectedRoute>
            }
          />
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <PageMeta
                  title="Создание нового навыка"
                  description="Добавьте новый навык для обмена на SkillSwap. Подробно опишите ваши умения, укажите уровень владения, формат обучения и условия обмена."
                  ogTitle="Создайте новый навык на SkillSwap"
                  ogDescription="Добавьте свой уникальный навык на платформу обмена знаниями. Подробное описание увеличит шансы найти заинтересованных учеников."
                >
                  <SkillEditPage />
                </PageMeta>
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:skillId"
            element={
              <ProtectedRoute>
                <PageMeta
                  title="Редактирование навыка"
                  description="Измените информацию о вашем навыке на SkillSwap: обновите описание, добавьте новые примеры работ или скорректируйте условия обмена."
                  ogTitle="Редактирование навыка на SkillSwap"
                  ogDescription="Обновите информацию о вашем навыке. Сделайте описание более привлекательным для потенциальных учеников."
                >
                  <SkillEditPage />
                </PageMeta>
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <PageMeta
                title="Избранные предложения"
                description="Ваша коллекция сохраненных предложений обмена на SkillSwap. Быстрый доступ к интересным навыкам, менторам и возможностям для обучения."
                ogTitle="Избранное на SkillSwap — ваши будущие обмены"
                ogDescription="Сохраняйте интересные предложения обмена навыками. Возвращайтесь к ним позже, когда будете готовы начать обучение."
              >
                <FavoritesPage />
              </PageMeta>
            </ProtectedRoute>
          }
        />
        <Route
          path="exchanges"
          element={
            <ProtectedRoute>
              <PageMeta
                title="Активные обмены"
                description="Управляйте текущими обменами навыками на SkillSwap. Отслеживайте прогресс, общайтесь с партнерами, подтверждайте завершение и оставляйте отзывы."
                ogTitle="Активные обмены навыками на SkillSwap"
                ogDescription="Следите за ходом ваших обменов знаниями. Общайтесь с партнерами, отслеживайте прогресс и завершайте обучение успешно."
              >
                <ExchangesPage />
              </PageMeta>
            </ProtectedRoute>
          }
        />
        <Route
          path="requests"
          element={
            <ProtectedRoute>
              <PageMeta
                title="Заявки на обмен"
                description="Входящие и исходящие запросы на обмен навыками. Просматривайте предложения, принимайте или отклоняйте заявки, ведите переговоры об условиях."
                ogTitle="Заявки на обмен навыками на SkillSwap"
                ogDescription="Управляйте запросами на обмен знаниями. Отвечайте на предложения и находите идеальных партнеров для обучения."
              >
                <RequestsPage />
              </PageMeta>
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="create-offer"
        element={
          <ProtectedRoute>
            <PageMeta
              title="Создание предложения обмена"
              description="Создайте новое публичное предложение обмена навыками на SkillSwap. Укажите что предлагаете и что ищете, задайте условия и найдите идеального партнера для взаимного обучения."
              ogTitle="Создайте предложение обмена на SkillSwap"
              ogDescription="Предложите свой навык в обмен на нужные вам знания. Найдите идеального партнера для взаимного обучения в сообществе SkillSwap."
            >
              <CreateOffer />
            </PageMeta>
          </ProtectedRoute>
        }
      />
      <Route
        path="user/:userId"
        element={
          <ProtectedRoute>
            <PageMeta
              title="Профиль пользователя"
              description="Просмотр профиля участника SkillSwap. Ознакомьтесь с навыками пользователя, отзывами, рейтингом и предложениями обмена. Начните сотрудничество!"
              ogTitle="Профиль пользователя SkillSwap"
              ogDescription="Посмотрите профиль участника сообщества обмена навыками. Узнайте о его умениях, опыте и начните сотрудничество."
            >
              <UserPage />
            </PageMeta>
          </ProtectedRoute>
        }
      />
      <Route
        path="about"
        element={
          <PageMeta
            title="О проекте"
            description="Узнайте больше о SkillSwap — платформе для взаимного обмена навыками и знаниями."
          >
            <UnderConstructionPage />
          </PageMeta>
        }
      />
      <Route
        path="contacts"
        element={
          <PageMeta
            title="Контакты"
            description="Свяжитесь с нами — мы всегда рады помочь и ответить на ваши вопросы."
          >
            <UnderConstructionPage />
          </PageMeta>
        }
      />
      <Route
        path="blog"
        element={
          <PageMeta
            title="Блог"
            description="Читайте интересные статьи о взаимном обучении, развитии навыков и сообществе SkillSwap."
          >
            <UnderConstructionPage />
          </PageMeta>
        }
      />
      <Route
        path="privacy"
        element={
          <PageMeta
            title="Политика конфиденциальности"
            description="Политика конфиденциальности SkillSwap — как мы защищаем ваши персональные данные."
          >
            <UnderConstructionPage />
          </PageMeta>
        }
      />
      <Route
        path="terms"
        element={
          <PageMeta
            title="Пользовательское соглашение"
            description="Пользовательское соглашение SkillSwap — правила использования платформы."
          >
            <UnderConstructionPage />
          </PageMeta>
        }
      />
      <Route
        path="500"
        element={
          <PageMeta
            title="Ошибка сервера"
            description="На платформе SkillSwap возникла техническая ошибка. Наша команда уже работает над решением проблемы. Пожалуйста, попробуйте позже или вернитесь на главную страницу."
            ogTitle="Ошибка на SkillSwap"
            ogDescription="На платформе обмена навыками временные технические неполадки. Мы уже работаем над решением. Приносим извинения за неудобства."
          >
            <ErrorPage statusCode="500" />
          </PageMeta>
        }
      />
      <Route
        path="*"
        element={
          <PageMeta
            title="Страница не найдена"
            description="К сожалению, запрашиваемая страница не существует. Возможно, она была перемещена или удалена. Вернитесь на главную страницу SkillSwap для поиска обмена навыками."
            ogTitle="Страница не найдена на SkillSwap"
            ogDescription="Запрашиваемая страница на платформе обмена навыками не существует. Вернитесь на главную, чтобы найти интересные предложения обмена."
          >
            <ErrorPage statusCode="404" />
          </PageMeta>
        }
      />
    </Route>
    <Route
      path="login"
      element={
        <ProtectedRoute requireAuth={false}>
          <PageMeta
            title="Вход в аккаунт"
            description="Войдите в ваш аккаунт SkillSwap для доступа к персональным предложениям, управления навыками и участия в обменах. Еще нет аккаунта? Зарегистрируйтесь бесплатно."
            ogTitle="Вход в SkillSwap — платформу обмена навыками"
            ogDescription="Войдите в свой аккаунт на платформе взаимного обучения. Получите доступ к персональным предложениям обмена знаниями."
          >
            <Login />
          </PageMeta>
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
            <PageMeta
              title="Вход в сообщество обмена навыками"
              description="Создайте аккаунт для доступа к уникальному сообществу SkillSwap. Придумайте логин и пароль — ваш первый шаг к взаимному обучению."
              ogTitle="Присоединяйтесь к SkillSwap — сообществу взаимного обучения"
              ogDescription="Создайте аккаунт на уникальной платформе обмена навыками. Начните бесплатно обучаться у других и делиться своими знаниями."
            >
              <SignupStepOne />
            </PageMeta>
          </ProtectedRoute>
        }
      />
      <Route
        path="step2"
        element={
          <PageMeta
            title="Ваши цели обучения на SkillSwap"
            description="Что вы хотите изучить? Выберите категории навыков для развития. Чем точнее вы определите цели, тем лучше мы подберем менторов и единомышленников."
            ogTitle="Выберите навыки для изучения на SkillSwap"
            ogDescription="Определите, каким навыкам хотите научиться. Мы подберем идеальных менторов в нашем сообществе взаимного обучения."
          >
            <SignupStepTwo />
          </PageMeta>
        }
      />
      <Route
        path="step3"
        element={
          <PageMeta
            title="Ваш вклад в сообщество"
            description="Какими знаниями готовы поделиться? Опишите ваши экспертные навыки. Взаимный обмен — основа нашего сообщества. Завершите регистрацию и начинайте обмен!"
            ogTitle="Поделитесь своими навыками с сообществом SkillSwap"
            ogDescription="Опишите свои экспертные умения и станьте ментором для других. Взаимный обмен знаниями делает наше сообщество сильнее."
          >
            <SignupStepThree />
          </PageMeta>
        }
      />
    </Route>
  </Routes>
);
