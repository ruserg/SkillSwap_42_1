import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@shared/ui/Card/Card";
import { OfferPreview } from "@widgets/OfferPreview/OfferPreview";
import { Button } from "@shared/ui/Button/Button";
import { ArrowLeftIcon } from "@shared/ui/Icons/ArrowLeftIcon";
import styles from "./userPage.module.scss";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { fetchUsersData, selectUsers } from "@entities/user/model/slice";
import { fetchCities, selectCities } from "@entities/city/model/slice";
import { fetchSkillsData } from "@entities/skill/model/slice";
import { fetchCategories } from "@entities/category/model/slice";
import {
  selectIsAuthenticated,
  selectUser as selectAuthUser,
} from "@features/auth/model/slice";
import {
  createExchange,
  getExchange,
  selectCurrentExchange,
  clearExchange,
} from "@entities/exchange/model/slice";
import { fetchToastNotification } from "@entities/notification/model/slice";
import { api } from "@shared/api/api";

interface UserOffer {
  id: string;
  skillName: string;
  categoryName: string;
  subcategoryName: string;
  description: string;
  images: string[];
  createdAt: string;
  userInfo: {
    firstName: string;
    city: string;
    gender: string;
    dateOfBirth: string;
    avatar: string;
  };
}

export const UserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const { cities } = useAppSelector(selectCities);
  const { skills } = useAppSelector((state) => state.skillsData);
  const { subcategories, categories } = useAppSelector(
    (state) => state.categoryData,
  );
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authUser = useAppSelector(selectAuthUser);

  // Redux state для обменов
  const currentExchange = useAppSelector(selectCurrentExchange);

  const [userOffers, setUserOffers] = useState<UserOffer[]>([]);

  // Загружаем все необходимые данные и проверяем существующие обмены
  useEffect(() => {
    // Очищаем обмен при переходе на другого пользователя
    dispatch(clearExchange());

    const loadAllData = async () => {
      try {
        await Promise.all([
          dispatch(fetchUsersData()).unwrap(),
          dispatch(fetchCities()).unwrap(),
          dispatch(fetchSkillsData()).unwrap(),
          dispatch(fetchCategories()).unwrap(),
        ]);

        // Проверяем существующие обмены между текущим пользователем и просматриваемым
        if (authUser && userId && isAuthenticated) {
          try {
            const exchanges = await api.getUserExchanges(authUser.id);
            const existingExchange = exchanges.find(
              (exchange) =>
                (exchange.fromUserId === authUser.id &&
                  exchange.toUserId === parseInt(userId, 10)) ||
                (exchange.toUserId === authUser.id &&
                  exchange.fromUserId === parseInt(userId, 10)),
            );

            if (
              existingExchange &&
              (existingExchange.status === "pending" ||
                existingExchange.status === "accepted")
            ) {
              // Загружаем полную информацию об обмене
              await dispatch(getExchange(existingExchange.id)).unwrap();
              // Проверяем тосты, если обмен уже подтвержден
              if (existingExchange.status === "accepted") {
                await dispatch(fetchToastNotification()).unwrap();
              }
            } else {
              // Если обмен не найден, очищаем текущий обмен
              dispatch(clearExchange());
            }
          } catch (error) {
            console.error("Error loading exchanges:", error);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadAllData();
  }, [dispatch, authUser, userId, isAuthenticated]);

  // Загружаем предложения пользователя из localStorage
  useEffect(() => {
    if (userId) {
      try {
        const allOffers = JSON.parse(
          localStorage.getItem("userOffers") || "[]",
        );
        setUserOffers(allOffers);
      } catch (error) {
        console.error("Error loading user offers:", error);
        setUserOffers([]);
      }
    }
  }, [userId]);

  // Находим текущего пользователя
  const currentUser = useMemo(() => {
    const foundUser = users.find((u) => u.id.toString() === userId);
    if (!foundUser) return null;

    return {
      ...foundUser,
      likesCount: foundUser.likesCount || foundUser.likes || 0,
      isLikedByCurrentUser: foundUser.isLikedByCurrentUser || false,
    };
  }, [users, userId]);

  // Получаем навыки пользователя типа "offer" (может научить)
  const userTeachSkills = useMemo(() => {
    if (!currentUser || !userId || skills.length === 0) return [];
    return skills.filter(
      (skill) =>
        skill.userId === currentUser.id && skill.type_of_proposal === "offer",
    );
  }, [currentUser, userId, skills]);

  // Берем первый навык "offer" для отображения
  const currentSkill = useMemo(() => {
    if (userTeachSkills.length === 0) return null;
    // Сортируем по дате изменения (новые первыми) и берем первый
    return [...userTeachSkills].sort((a, b) => {
      const dateA = new Date(a.modified_datetime).getTime();
      const dateB = new Date(b.modified_datetime).getTime();
      return dateB - dateA;
    })[0];
  }, [userTeachSkills]);

  // Получаем данные для OfferPreview из реального навыка
  const offerData = useMemo(() => {
    if (currentSkill && subcategories.length > 0 && categories.length > 0) {
      const subcategory = subcategories.find(
        (sub) => sub.id === currentSkill.subcategoryId,
      );
      const category = subcategory
        ? categories.find((cat) => cat.id === subcategory.categoryId)
        : null;

      return {
        skillName: currentSkill.name || "",
        categoryName: category?.name || "",
        subcategoryName: subcategory?.name || "",
        description: currentSkill.description || "",
        images: currentSkill.images || [],
      };
    }

    // Fallback на данные из localStorage если нет навыков
    if (userOffers.length > 0) {
      const latestOffer = userOffers.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
      return {
        skillName: latestOffer.skillName,
        categoryName: latestOffer.categoryName,
        subcategoryName: latestOffer.subcategoryName,
        description: latestOffer.description,
        images: latestOffer.images,
      };
    }

    return null;
  }, [currentSkill, subcategories, categories, userOffers]);

  // Похожие пользователи
  const similarUsers = useMemo(() => {
    if (!currentUser || users.length <= 1) return [];

    const currentUserId = currentUser.id;
    const otherUsers = users.filter((u) => u.id !== currentUserId);

    if (otherUsers.length <= 4) {
      return otherUsers.map((u) => ({
        ...u,
        likesCount: u.likesCount || u.likes || 0,
        isLikedByCurrentUser: u.isLikedByCurrentUser || false,
      }));
    }

    const sortedUsers = [...otherUsers].sort((a, b) => {
      const diffA = Math.abs(a.id - currentUserId);
      const diffB = Math.abs(b.id - currentUserId);

      if (diffA !== diffB) {
        return diffA - diffB;
      }

      return a.id - b.id;
    });

    return sortedUsers.slice(0, 4).map((u) => ({
      ...u,
      likesCount: u.likesCount || u.likes || 0,
      isLikedByCurrentUser: u.isLikedByCurrentUser || false,
    }));
  }, [currentUser, users]);

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Получаем навык текущего авторизованного пользователя типа "offer"
  const currentUserSkill = useMemo(() => {
    if (!authUser || !skills.length) return null;
    const userSkills = skills.filter(
      (skill) =>
        skill.userId === authUser.id && skill.type_of_proposal === "offer",
    );
    return userSkills.length > 0 ? userSkills[0] : null;
  }, [authUser, skills]);

  // Проверяем тосты при создании обмена (одна проверка через 12 секунд)
  useEffect(() => {
    if (currentExchange && isAuthenticated) {
      const exchangeId = currentExchange.id;
      const initialStatus = currentExchange.status;

      // Если статус уже accepted, проверяем тост сразу
      if (initialStatus === "accepted") {
        dispatch(fetchToastNotification());
        return;
      }

      // Если статус pending, проверяем тост через 12 секунд (бэкенд подтверждает через 10)
      const timeout = setTimeout(async () => {
        try {
          // Проверяем статус обмена
          const updatedExchange = await api.getExchange(exchangeId);
          if (updatedExchange.status === "accepted") {
            // Обновляем статус в Redux
            await dispatch(getExchange(exchangeId)).unwrap();
          }
          // Проверяем тост
          await dispatch(fetchToastNotification()).unwrap();
        } catch (error) {
          // Игнорируем ошибки
        }
      }, 12000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [currentExchange?.id, isAuthenticated, dispatch]);

  const handleExchangeClick = useCallback(async () => {
    if (!currentUser || !userId || !authUser) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/user/${userId}` } });
      return;
    }

    // Проверяем наличие навыков у обоих пользователей
    if (!currentSkill || !currentUserSkill) {
      alert(
        "Для обмена необходимо, чтобы у обоих пользователей были навыки типа 'Может научить'",
      );
      return;
    }

    try {
      // Создаем запрос на обмен
      await dispatch(
        createExchange({
          fromUserId: authUser.id,
          toUserId: parseInt(userId, 10),
          fromSkillId: currentUserSkill.id,
          toSkillId: currentSkill.id,
        }),
      ).unwrap();
    } catch (error: any) {
      console.error("Ошибка при создании запроса на обмен:", error);
      alert(error || "Не удалось отправить запрос на обмен");
    }
  }, [
    currentUser,
    userId,
    authUser,
    isAuthenticated,
    navigate,
    dispatch,
    currentSkill,
    currentUserSkill,
  ]);

  const isLoading =
    !currentUser ||
    !cities ||
    skills.length === 0 ||
    subcategories.length === 0;

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>Пользователь не найден</p>
          <Button variant="secondary" onClick={handleBackClick}>
            Назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Верхний ряд: профиль + OfferPreview */}
        <div className={styles.topRow}>
          {/* Левая колонка - профиль пользователя */}
          <Card
            user={currentUser}
            cities={cities}
            variant="profile"
            description={currentUser.about || ""}
          />

          {/* Правая колонка - предложение */}
          {offerData ? (
            <OfferPreview
              variant="userProfileOffer"
              skillName={offerData.skillName}
              categoryName={offerData.categoryName}
              subcategoryName={offerData.subcategoryName}
              description={offerData.description}
              images={offerData.images}
              onExchange={handleExchangeClick}
              isExchangeProposed={
                currentExchange?.status === "accepted" ||
                currentExchange?.status === "pending"
              }
              exchangeStatus={currentExchange?.status}
            />
          ) : (
            <div className={styles.noOffer}>
              <p>У пользователя пока нет предложений</p>
            </div>
          )}
        </div>

        {/* Нижний ряд: похожие предложения на всю ширину */}
        <div className={styles.similarSection}>
          <h2 className={styles.similarTitle}>Похожие предложения</h2>
          <div className={styles.similarCards}>
            {similarUsers.length > 0 ? (
              similarUsers.map((user) => <Card user={user} cities={cities} />)
            ) : (
              <div className={styles.noSimilar}>
                <p>Нет похожих предложений</p>
                <div className={styles.exploreButtonWrapper}>
                  <Button variant="secondary" onClick={handleBackClick}>
                    На главную
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserPage);
