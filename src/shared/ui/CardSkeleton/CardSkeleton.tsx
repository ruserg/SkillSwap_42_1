import cardStyles from "@shared/ui/Card/card.module.scss";
import skeletonStyles from "./cardSkeleton.module.scss";

export const CardSkeleton = () => {
  return (
    <div className={cardStyles.container}>
      {/* Заголовок карточки с аватаром */}
      <div className={cardStyles.header}>
        <div
          className={`${cardStyles.avatar} ${skeletonStyles.skeleton} ${skeletonStyles.skeletonAvatar}`}
        />
        <div className={cardStyles.userInfo}>
          <div
            className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonName}`}
          />
          <div
            className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonDetails}`}
          />
        </div>
      </div>

      {/* Секция "Может научить" */}
      <div className={cardStyles.section}>
        <div className={cardStyles.sectionTitle}>Может научить:</div>
        <div className={cardStyles.skillItem}>
          <div
            className={`${cardStyles.tag} ${skeletonStyles.skeleton} ${skeletonStyles.skeletonTag}`}
          />
        </div>
      </div>

      {/* Секция "Хочет научиться" */}
      <div className={cardStyles.section}>
        <div className={cardStyles.sectionTitle}>Хочет научиться:</div>
        <div className={cardStyles.learnTags}>
          <div
            className={`${cardStyles.learnTag} ${skeletonStyles.skeleton} ${skeletonStyles.skeletonTag}`}
          />
          <div
            className={`${cardStyles.learnTag} ${skeletonStyles.skeleton} ${skeletonStyles.skeletonTag}`}
          />
        </div>
      </div>

      {/* Кнопка "Подробнее" */}
      <div className={cardStyles.actions}>
        <div className={cardStyles.detailsButton}>
          <div
            className={`${skeletonStyles.skeleton} ${skeletonStyles.skeletonButton}`}
          />
        </div>
      </div>
    </div>
  );
};
