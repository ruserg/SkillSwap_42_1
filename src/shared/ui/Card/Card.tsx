import React, { memo, useState, useEffect } from "react";
import { Button } from "@shared/ui/Button";
import type { CardProps } from "./type";
import type { TSkill } from "@/shared/types/types";
import styles from "./card.module.scss";
import { calculateAge } from "../../../../public/utils/ageCalculator";

export const Card: React.FC<CardProps> = memo(
  ({ user, cities, onDetailsClick, className = "", isLoading = false }) => {
    const [skills, setSkills] = useState<TSkill[]>([]);
    const [skillsLoading, setSkillsLoading] = useState(true);

    // Загружаем навыки при монтировании компонента
    useEffect(() => {
      const loadSkills = async () => {
        try {
          const response = await fetch("/db/skills.json");
          const data: TSkill[] = await response.json(); // data - это массив навыков
          setSkills(data);
        } catch (error) {
          console.error("Error loading skills:", error);
          setSkills([]);
        } finally {
          setSkillsLoading(false);
        }
      };

      loadSkills();
    }, []);

    // Функция для получения цвета фона тега на основе категории
    const getTagClassName = (categoryId: number): string => {
      const colorMap: Record<number, string> = {
        1: styles.business,
        2: styles.creativity,
        3: styles.languages,
        4: styles.education,
        5: styles.home,
        6: styles.health,
      };
      return colorMap[categoryId] || styles.default;
    };

    // Функция для получения названия города по cityId
    const getCityName = (cityId: number): string => {
      const city = cities.find((c) => c.id === cityId);
      return city ? city.name : "Город не указан";
    };

    // Функция для получения категории по subcategoryId
    const getCategoryId = (subcategoryId: number): number => {
      // subcategoryId от 1 до 8 -> категория 1 (Бизнес)
      // subcategoryId от 9 до 16 -> категория 2 (Творчество)
      // subcategoryId от 17 до 23 -> категория 3 (Языки)
      // subcategoryId от 24 до 29 -> категория 4 (Образование)
      // subcategoryId от 30 до 35 -> категория 5 (Дом)
      // subcategoryId от 36 до 42 -> категория 6 (Здоровье)
      if (subcategoryId >= 1 && subcategoryId <= 8) return 1;
      if (subcategoryId >= 9 && subcategoryId <= 16) return 2;
      if (subcategoryId >= 17 && subcategoryId <= 23) return 3;
      if (subcategoryId >= 24 && subcategoryId <= 29) return 4;
      if (subcategoryId >= 30 && subcategoryId <= 35) return 5;
      if (subcategoryId >= 36 && subcategoryId <= 42) return 6;
      return 0;
    };

    // Функция для получения навыков пользователя по типу
    const getUserSkillsByType = (type: "canTeach" | "wantToLearn") => {
      return skills.filter(
        (skill) =>
          skill.userId === user.id &&
          skill.type_of_proposal === (type === "canTeach" ? "учу" : "учусь"),
      );
    };

    // Получаем навыки пользователя
    const canTeachSkills = getUserSkillsByType("canTeach");
    const wantToLearnSkills = getUserSkillsByType("wantToLearn");

    const handleDetailsClick = React.useCallback(() => {
      if (!isLoading && !skillsLoading) {
        onDetailsClick?.(user);
      }
    }, [isLoading, skillsLoading, onDetailsClick, user]);

    const isCardLoading = isLoading || skillsLoading;

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
            <h3 className={styles.name}>{user.name}</h3>
            <p className={styles.details}>
              {getCityName(user.cityId)}, {calculateAge(user.dateOfBirth)}
            </p>
          </div>
        </div>

        {/* Навык, которому может научить */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Может научить:</div>
          <div className={styles.skillItem}>
            <div className={styles.skillInfo}>
              <div className={styles.tags}>
                {canTeachSkills.slice(0, 1).map((skill) => {
                  const categoryId = getCategoryId(skill.subcategoryId);
                  const tagClassName = getTagClassName(categoryId);

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
            {wantToLearnSkills.slice(0, 2).map((skill) => {
              const categoryId = getCategoryId(skill.subcategoryId);
              const tagClassName = getTagClassName(categoryId);

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
