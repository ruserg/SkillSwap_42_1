import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@shared/ui/Card/Card";
import { OfferPreview } from "@widgets/OfferPreview/OfferPreview";
import { Button } from "@shared/ui/Button/Button";
import { ArrowLeftIcon } from "@shared/ui/Icons/ArrowLeftIcon";
import type { UserWithLikes } from "@entities/user/types";
import styles from "./userPage.module.scss";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { fetchUsersData, selectUsers } from "@entities/user/model/slice";
import { fetchCities, selectCities } from "@entities/city/model/slice";
import { fetchSkillsData } from "@entities/skill/model/slice";
import { fetchCategories } from "@entities/category/model/slice";
import { selectIsAuthenticated } from "@features/auth/model/slice";
import { selectStep3Images } from "@features/signup/model/slice";

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
  const signupImages = useAppSelector(selectStep3Images);
  const users = useAppSelector(selectUsers);
  const { cities } = useAppSelector(selectCities);
  const { skills } = useAppSelector((state) => state.skillsData);
  const { subcategories } = useAppSelector((state) => state.categoryData);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [userOffers, setUserOffers] = useState<UserOffer[]>([]);
  const [isExchangeProposed, setIsExchangeProposed] = useState(false);

  // Загружаем все необходимые данные
  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([
          dispatch(fetchUsersData()).unwrap(),
          dispatch(fetchCities()).unwrap(),
          dispatch(fetchSkillsData()).unwrap(),
          dispatch(fetchCategories()).unwrap(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadAllData();
  }, [dispatch]);

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

  // Берем последнее предложение пользователя
  const latestOffer = useMemo(() => {
    if (userOffers.length > 0) {
      return userOffers.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
    }
    return null;
  }, [userOffers]);

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

  const handleExchangeClick = useCallback(() => {
    if (!currentUser || !userId) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/user/${userId}` } });
      return;
    }

    localStorage.setItem(`exchange_${userId}`, "true");
    setIsExchangeProposed(true);
  }, [currentUser, userId, isAuthenticated, navigate]);

  const handleCardClick = useCallback(
    (user: UserWithLikes) => {
      if (!isAuthenticated) {
        navigate("/login", { state: { from: `/user/${user.id}` } });
        return;
      }

      navigate(`/user/${user.id}`);
    },
    [navigate, isAuthenticated],
  );

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
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Кнопка назад */}
          <div className={styles.backButton}>
            <Button
              variant="secondary"
              leftIcon={<ArrowLeftIcon />}
              onClick={handleBackClick}
            >
              Назад
            </Button>
          </div>

          {/* Верхний ряд: профиль + OfferPreview */}
          <div className={styles.topRow}>
            {/* Левая колонка - профиль пользователя */}
            <div className={styles.profileColumn}>
              <div className={styles.profileCardWrapper}>
                <Card
                  user={currentUser}
                  cities={cities}
                  variant="profile"
                  description="Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое"
                />
              </div>
            </div>

            {/* Правая колонка - предложение */}
            <div className={styles.offerColumn}>
              <div className={styles.offerSection}>
                <div className={styles.offerPreviewContainer}>
                  <OfferPreview
                    variant="userProfileOffer"
                    skillName={latestOffer?.skillName || "Игра на барабанах"}
                    categoryName={
                      latestOffer?.categoryName || "Творчество и искусство"
                    }
                    subcategoryName={
                      latestOffer?.subcategoryName || "Музыка и звук"
                    }
                    description={
                      latestOffer?.description ||
                      "Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без паритуры"
                    }
                    images={signupImages}
                    onExchange={handleExchangeClick}
                    isExchangeProposed={isExchangeProposed}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Нижний ряд: похожие предложения на всю ширину */}
          <div className={styles.similarSection}>
            <h2 className={styles.similarTitle}>Похожие предложения</h2>
            <div className={styles.similarCards}>
              {similarUsers.length > 0 ? (
                similarUsers.map((user) => (
                  <div key={user.id} className={styles.similarCard}>
                    <Card user={user} cities={cities} />
                  </div>
                ))
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
      </main>
    </div>
  );
};

export default React.memo(UserPage);
