import React, { memo, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shared/ui/Button/Button";
import type { CardProps } from "./types";
import type { TSkill } from "@entities/skill/types";
import styles from "./card.module.scss";
import { calculateAge } from "@shared/lib/utils/ageCalculator";
import { Like } from "@shared/ui/Like/Like";
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
import defaultAvatar from "@shared/assets/images/icons/default-avatar.svg";

export const Card: React.FC<CardProps> = memo(
  ({
    user,
    cities,
    className = "",
    isLoading = false,
    variant = "default",
    description = "Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое",
    buttonText,
    buttonDeleteText,
    buttonAcceptText,
    buttonRejectText,
    buttonCancelText,
    onDetailsClick,
    onDeleteClick,
    onAcceptClick,
    onRejectClick,
    onCancelClick,
  }) => {
    const navigate = useNavigate();

    const { skills } = useAppSelector(selectSkillsData);
    const { subcategories } = useAppSelector(selectCategoryData);

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const titleId = useMemo(() => `card-title-${user.id}`, [user.id]);

    const handleDetailsClick = useCallback(() => {
      if (isLoading) return;

      if (onDetailsClick) {
        onDetailsClick();
        return;
      }

      navigate(`/user/${user.id}`);
    }, [isLoading, navigate, user.id, onDetailsClick]);

    const { canTeachSkills, wantToLearnSkills } = useMemo(
      () => ({
        canTeachSkills: getUserSkillsByType(skills, user.id, "offer"),
        wantToLearnSkills: getUserSkillsByType(skills, user.id, "request"),
      }),
      [skills, user.id],
    );

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

    const renderTeachTags = useCallback(() => {
      if (canTeachSkills.length === 0) {
        return (
          <div
            className={`${styles.tag} ${styles.default}`}
            role="listitem"
            aria-label="Навыки не указаны"
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
                role="listitem"
                aria-label={`Навык: ${skill.name}`}
              >
                {skill.name}
              </div>
            );
          })}

          {hasAdditional && (
            <div
              className={`${styles.tag} ${styles.additional}`}
              role="listitem"
              aria-label={`Ещё ${canTeachSkills.length - visibleCount} навыков`}
            >
              +{canTeachSkills.length - visibleCount}
            </div>
          )}
        </>
      );
    }, [canTeachSkills, subcategories, getVisibleSkillsCount]);

    const renderLearnTags = useCallback(() => {
      if (wantToLearnSkills.length === 0) {
        return (
          <div
            className={`${styles.learnTag} ${styles.default}`}
            role="listitem"
            aria-label="Навыки не указаны"
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
                role="listitem"
                aria-label={`Навык: ${skill.name}`}
              >
                {skill.name}
              </div>
            );
          })}

          {hasAdditional && (
            <div
              className={`${styles.learnTag} ${styles.additional}`}
              role="listitem"
              aria-label={`Ещё ${wantToLearnSkills.length - visibleCount} навыков`}
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
        aria-labelledby={titleId}
        aria-busy={isLoading}
        aria-live={isLoading ? "polite" : "off"}
      >
        {/* Заголовок карточки с аватаром и информацией о пользователе */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            <img
              src={user.avatarUrl}
              alt={user.name}
              width={96}
              height={96}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultAvatar;
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

        {/* кнопки действий (не показываем для variant="profile") */}
        {variant !== "profile" && (
          <div className={styles.actions}>
            {/* Кнопки для заявок: Принять и Отклонить */}
            {onAcceptClick && onRejectClick ? (
              <div className={styles.actionsRow}>
                <div className={styles.acceptButton}>
                  <Button
                    variant="primary"
                    disabled={isLoading}
                    onClick={() => onAcceptClick?.(user)}
                    aria-label={`${buttonAcceptText || "Принять"} заявку от ${user.name}`}
                  >
                    {buttonAcceptText || "Принять"}
                  </Button>
                </div>
                <div className={styles.rejectButton}>
                  <Button
                    variant="secondary"
                    disabled={isLoading}
                    onClick={() => onRejectClick?.(user)}
                    aria-label={`${buttonRejectText || "Отклонить"} заявку от ${user.name}`}
                    style={{ color: "var(--color-error)" }}
                  >
                    {buttonRejectText || "Отклонить"}
                  </Button>
                </div>
              </div>
            ) : onCancelClick ? (
              // Кнопка для отзыва заявки
              <div className={styles.detailsButton}>
                <Button
                  variant="secondary"
                  disabled={isLoading}
                  onClick={() => onCancelClick?.(user)}
                  aria-label={`${buttonCancelText || "Отозвать заявку"} пользователю ${user.name}`}
                >
                  {buttonCancelText || "Отозвать заявку"}
                </Button>
              </div>
            ) : onDeleteClick ? (
              // Кнопки: Подробнее и Удалить
              <div className={styles.actionsRow}>
                <div className={styles.detailsButton}>
                  <Button
                    variant="primary"
                    disabled={isLoading}
                    onClick={handleDetailsClick}
                    aria-label={`${buttonText || "Подробнее"} о пользователе ${user.name}`}
                  >
                    {buttonText || "Подробнее"}
                  </Button>
                </div>
                <div className={styles.deleteButton}>
                  <Button
                    variant="secondary"
                    disabled={isLoading}
                    onClick={() => onDeleteClick?.(user)}
                    aria-label={`${buttonDeleteText || "Удалить"} обмен с пользователем ${user.name}`}
                    style={{ color: "var(--color-error)" }}
                  >
                    {buttonDeleteText || "Удалить"}
                  </Button>
                </div>
              </div>
            ) : (
              // Только кнопка "Подробнее"
              <div className={styles.detailsButton}>
                <Button
                  variant="primary"
                  disabled={isLoading}
                  onClick={handleDetailsClick}
                  aria-label={`${buttonText || "Подробнее"} о пользователе ${user.name}`}
                >
                  {buttonText || "Подробнее"}
                </Button>
              </div>
            )}
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
