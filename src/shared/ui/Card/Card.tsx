import React, { memo, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shared/ui/Button/Button";
import type { CardProps } from "./types";
import type { TSkill } from "@entities/skill/types";
import styles from "./card.module.scss";
import { calculateAge } from "@shared/lib/utils/ageCalculator";
import { Like } from "../Like/Like";
import { getUserSkillsByType } from "@shared/lib/utils/skillUtils";
import {
  getTagClassName,
  getCategoryIdBySubcategory,
} from "@shared/lib/utils/categoryUtils";
import { getCityNameById } from "@shared/lib/utils/cityUtils";
import { useAppSelector } from "@app/store/hooks";
import { selectSkillsData } from "@entities/skill/model/slice";
import { selectCategoryData } from "@entities/category/model/slice";
import { selectIsAuthenticated } from "@features/auth/model/slice";

export const Card: React.FC<CardProps> = memo(
  ({
    user,
    cities,
    className = "",
    isLoading = false,
    variant = "default",
    description = "Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое",
  }) => {
    const navigate = useNavigate();

    // Получаем данные из Redux
    const { skills } = useAppSelector(selectSkillsData);
    const { subcategories } = useAppSelector(selectCategoryData);

    // Получаем статус авторизации ТОЛЬКО из Redux
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    // Генерируем уникальный ID для заголовка, он нужен для aria-labelledby
    const titleId = useMemo(() => `card-title-${user.id}`, [user.id]);

    const handleDetailsClick = useCallback(() => {
      if (isLoading) return;
      // Если авторизован - переход на страницу пользователя
      navigate(`/user/${user.id}`);
    }, [isLoading, isAuthenticated, navigate, user.id]);

    // Мемоизированные навыки пользователя
    const { canTeachSkills, wantToLearnSkills } = useMemo(
      () => ({
        canTeachSkills: getUserSkillsByType(skills, user.id, "offer"),
        wantToLearnSkills: getUserSkillsByType(skills, user.id, "request"),
      }),
      [skills, user.id],
    );

    // Определяем количество показываемых навыков в зависимости от варианта
    const getVisibleSkillsCount = useCallback(() => {
      switch (variant) {
        case "profile":
          return 2;
        case "compact":
          return 1;
        default:
          return 1;
      }
    }, [variant]);

    // Функция для рендеринга тегов с логикой "+N" для секции "Может научить"
    const renderTeachTags = useCallback(() => {
      if (canTeachSkills.length === 0) {
        return (
          <div
            className={`${styles.tag} ${styles.default}`}
            role="listitem" //это элемент списка для скринридеров
            aria-label="Навыки не указаны" //описание для скринридеров, когда нет навыков
          >
            Навыки не указаны
          </div>
        );
      }

      const visibleCount = getVisibleSkillsCount();
      const visibleSkills = canTeachSkills.slice(0, visibleCount);
      const hasAdditional = canTeachSkills.length > visibleCount;

      return (
        <>
          {visibleSkills.map((skill: TSkill) => {
            const categoryId = getCategoryIdBySubcategory(
              skill.subcategoryId,
              subcategories,
            );
            const tagClassName = getTagClassName(categoryId, styles);

            return (
              <div
                key={skill.id}
                className={`${styles.tag} ${tagClassName}`}
                title={skill.name}
                role="listitem" //это элемент списка для скринридеров
                aria-label={`Навык: ${skill.name}`} //описание навыка для скринридеров
              >
                {skill.name}
              </div>
            );
          })}

          {hasAdditional && (
            <div
              className={`${styles.tag} ${styles.additional}`}
              role="listitem" //это элемент списка для скринридеров
              aria-label={`Ещё ${canTeachSkills.length - visibleCount} навыков`} //скринридер прочитает, что еще столько-то навыков
            >
              +{canTeachSkills.length - visibleCount}
            </div>
          )}
        </>
      );
    }, [canTeachSkills, subcategories, getVisibleSkillsCount]);

    // Функция для рендеринга тегов с логикой "+N" для секции "Хочет научиться"
    const renderLearnTags = useCallback(() => {
      if (wantToLearnSkills.length === 0) {
        return (
          <div
            className={`${styles.learnTag} ${styles.default}`}
            role="listitem" //это элемент списка для скринридеров
            aria-label="Навыки не указаны" //описане для скринридеров, когда навыки не указаны
          >
            Навыки не указаны
          </div>
        );
      }

      const visibleCount = getVisibleSkillsCount();
      const visibleSkills = wantToLearnSkills.slice(0, visibleCount);
      const hasAdditional = wantToLearnSkills.length > visibleCount;

      return (
        <>
          {visibleSkills.map((skill: TSkill) => {
            const categoryId = getCategoryIdBySubcategory(
              skill.subcategoryId,
              subcategories,
            );
            const tagClassName = getTagClassName(categoryId, styles);

            return (
              <div
                key={skill.id}
                className={`${styles.learnTag} ${tagClassName}`}
                title={skill.name}
                role="listitem" //это элемент списка для скринридеров
                aria-label={`Навык: ${skill.name}`} //описане навыка для скринридеров
              >
                {skill.name}
              </div>
            );
          })}

          {hasAdditional && (
            <div
              className={`${styles.learnTag} ${styles.additional}`}
              role="listitem" //это элемент списка для скринридеров
              aria-label={`Ещё ${wantToLearnSkills.length - visibleCount} навыков`} //скринридер прочитает, что еще столько-то навыков
            >
              +{wantToLearnSkills.length - visibleCount}
            </div>
          )}
        </>
      );
    }, [wantToLearnSkills, subcategories, getVisibleSkillsCount]);

    return (
      <article
        className={`${styles.container} ${className} ${
          isLoading ? styles.loading : ""
        } ${styles[variant]}`}
        aria-labelledby={titleId} // связываем карточку с заголовком для скринридера
        aria-busy={isLoading} // состояние загрузки для скринридеров
        aria-live={isLoading ? "polite" : "off"} // объявляем изменения при загрузке
      >
        {/* Заголовок карточки с аватаром и информацией о пользователе */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            <img
              src={user.avatarUrl}
              alt={user.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://i.pravatar.cc/150?img=0";
              }}
              loading="lazy"
            />
          </div>
          <div className={styles.userInfo}>
            <Like
              currentLikeCount={user.likesCount ?? 0}
              isLiked={user.isLikedByCurrentUser ?? false}
              userId={user.id}
              isAuthenticated={isAuthenticated}
              className={styles.like}
              onLikeToggle={() => {}}
            />
            {variant === "profile" ? (
              <h1 id={titleId} className={styles.name}>
                {user.name}{" "}
              </h1>
            ) : (
              <h3 id={titleId} className={styles.name}>
                {user.name}
              </h3>
            )}
            <p className={styles.details}>
              {getCityNameById(user.cityId, cities)},{" "}
              {calculateAge(user.dateOfBirth)}
            </p>
          </div>
        </div>

        {/* Описание пользователя (только для variant="profile") */}
        {variant === "profile" && description && (
          <div className={styles.description}>
            <p>{description}</p>
          </div>
        )}

        {/* Навык, которому может научить */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Может научить:</div>
          <div className={styles.tags} role="list">
            {renderTeachTags()}
          </div>
        </div>

        {/* Навыки, которым хочет научиться */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Хочет научиться:</div>
          <div className={styles.learnTags} role="list">
            {renderLearnTags()}
          </div>
        </div>

        {/* кнопка "Подробнее" (не показываем для variant="profile") */}
        {variant !== "profile" && (
          <div className={styles.actions}>
            <div className={styles.detailsButton}>
              <Button
                variant="primary"
                disabled={isLoading}
                onClick={handleDetailsClick}
                aria-label={`Подробнее о пользователе ${user.name}`}
              >
                Подробнее
              </Button>
            </div>
          </div>
        )}
      </article>
    );
  },
  // Функция сравнения пропсов для memo
  (prevProps, nextProps) => {
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.user.name === nextProps.user.name &&
      prevProps.user.avatarUrl === nextProps.user.avatarUrl &&
      prevProps.user.likesCount === nextProps.user.likesCount &&
      prevProps.user.isLikedByCurrentUser ===
        nextProps.user.isLikedByCurrentUser &&
      prevProps.user.cityId === nextProps.user.cityId &&
      prevProps.user.dateOfBirth === nextProps.user.dateOfBirth &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.variant === nextProps.variant &&
      prevProps.description === nextProps.description &&
      prevProps.className === nextProps.className &&
      prevProps.cities === nextProps.cities
    );
  },
);

Card.displayName = "Card";
export default Card;
