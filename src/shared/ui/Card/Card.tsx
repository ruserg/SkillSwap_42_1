import React, { memo, useState, useEffect } from "react";
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
import type { TSubcategory } from "@entities/category/types";

export const Card: React.FC<CardProps> = memo(
  ({
    user,
    cities,
    isAuthenticated = false,
    onDetailsClick,
    className = "",
    isLoading = false,
  }) => {
    const [skills, setSkills] = useState<TSkill[]>([]);
    const [skillsLoading, setSkillsLoading] = useState(true);
    const [subcategories, setSubcategories] = useState<TSubcategory[]>([]);
    const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);

    // Загружаем навыки и подкатегории при монтировании компонента
    useEffect(() => {
      const loadData = async () => {
        try {
          const skillsResponse = await fetch("/db/skills.json");
          const skillsData: TSkill[] = await skillsResponse.json();
          setSkills(skillsData);

          const subcategoriesResponse = await fetch("/db/subcategories.json");
          //subcategoriesData - массив подкатегорий
          const subcategoriesData: TSubcategory[] =
            await subcategoriesResponse.json();
          setSubcategories(subcategoriesData);
        } catch (error) {
          console.error("Error loading skills:", error);
          setSkills([]);
          setSubcategories([]);
        } finally {
          setSkillsLoading(false);
          setSubcategoriesLoading(false);
        }
      };

      loadData();
    }, []);

    // Получаем навыки пользователя
    const canTeachSkills = getUserSkillsByType(skills, user.id, "учу");
    const wantToLearnSkills = getUserSkillsByType(skills, user.id, "учусь");

    const handleDetailsClick = React.useCallback(() => {
      if (!isLoading && !skillsLoading && !subcategoriesLoading) {
        onDetailsClick?.(user);
      }
    }, [isLoading, skillsLoading, subcategoriesLoading, onDetailsClick, user]);

    const isCardLoading = isLoading || skillsLoading || subcategoriesLoading;

    return (
      <div
        className={`${styles.container} ${className} ${isCardLoading ? styles.loading : ""}`}
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
            {/* Загушка на будущее когда мы будем менять кол-во лайков через сервер и диспатч, если будем */}
            <h3 className={styles.name}>{user.name}</h3>
            <p className={styles.details}>
              {getCityNameById(user.cityId, cities)},{" "}
              {calculateAge(user.dateOfBirth)}
            </p>
          </div>
        </div>

        {/* Навык, которому может научить */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Может научить:</div>
          <div className={styles.skillItem}>
            <div className={styles.skillInfo}>
              <div className={styles.tags}>
                {canTeachSkills.slice(0, 1).map((skill: TSkill) => {
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
                    >
                      {skill.name}
                    </div>
                  );
                })}
                {canTeachSkills.length === 0 && !skillsLoading && (
                  <div className={`${styles.tag} ${styles.default}`}>
                    Навыки не указаны
                  </div>
                )}
                {skillsLoading && (
                  <div className={`${styles.tag} ${styles.default}`}>
                    Загрузка...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Навыки, которым хочет научиться */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Хочет научиться:</div>
          <div className={styles.learnTags}>
            {wantToLearnSkills.slice(0, 2).map((skill: TSkill) => {
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
                >
                  {skill.name}
                </div>
              );
            })}

            {wantToLearnSkills.length > 2 && (
              <div className={styles.additional}>
                +{wantToLearnSkills.length - 2}
              </div>
            )}
            {wantToLearnSkills.length === 0 && !skillsLoading && (
              <div className={`${styles.learnTag} ${styles.default}`}>
                Навыки не указаны
              </div>
            )}
            {skillsLoading && wantToLearnSkills.length === 0 && (
              <div className={`${styles.learnTag} ${styles.default}`}>
                Загрузка...
              </div>
            )}
          </div>
        </div>

        {/* кнопка "Подробнее" */}
        <div className={styles.actions}>
          <div className={styles.detailsButton}>
            <Button
              variant="primary"
              disabled={isCardLoading}
              onClick={handleDetailsClick}
            >
              {skillsLoading ? "Загрузка..." : "Подробнее"}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

Card.displayName = "Card";
export default Card;
