import React from "react";
import styles from "./offerPreview.module.scss";
import stylesModal from "./offerPreviewModal.module.scss";
import clsx from "clsx";
import { DecoratedButton } from "@shared/ui/DecoratedButton/DecoratedButton";
import { ImagesCarousel } from "@widgets/ImagesCarousel/ImagesCarousel";
import { Button } from "@shared/ui/Button/Button";
import { EditIcon } from "@shared/ui/Icons/EditIcon";
import type { TOfferProps } from "@widgets/OfferPreview/types";
import React from "react";

export const OfferPreview: React.FC<TOfferProps> = (props) => {
  const {
    variant = "userProfileOffer",
    skillName = "",
    categoryName = "",
    subcategoryName = "",
    description = "",
    images = [],
    onEdit,
    onConfirm,
    onExchange,
    isEditable = false,
  } = props;

  const showEditButtons = variant === "modalOffer" || isEditable;
  const isUserProfile = variant === "userProfileOffer";

export const OfferPreview: React.FC<TOfferProps> = (props) => {
  const {
    variant = "userProfileOffer",
    skillName = "",
    categoryName = "",
    subcategoryName = "",
    description = "",
    images = [],
    onEdit,
    onConfirm,
    onExchange,
    isEditable = false,
    isExchangeProposed = false,
  } = props;

  // Определяем, показывать ли кнопки редактирования
  const showEditButtons = variant === "modalOffer" || isEditable;
  const isUserProfile = variant === "userProfileOffer";

  return (
    <div className={styles.wrapper}>
      {variant === "modalOffer" && (
        <div className={stylesModal.containerModalTitle}>
          <h2 className={stylesModal.title}>Ваше предложение</h2>
          <p className={stylesModal.subTitle}>
            Пожалуйста, проверьте и подтвердите правильность данных
          </p>
        </div>
      )}

      <div className={styles.contentContainer}>
        <div className={styles.previewDescription}>
          <h2 className={styles.contentTittle}>
            {skillName || "Название навыка"}
          </h2>

          {(categoryName || subcategoryName) && (
            <p className={styles.contentContainerSubtitle}>
              {categoryName && (
                <span className={clsx(styles.category, styles.mainCategory)}>
                  {categoryName}
                </span>
              )}
              {categoryName && subcategoryName && " / "}
              {subcategoryName && (
                <span className={clsx(styles.category, styles.subCategory)}>
                  {subcategoryName}
                </span>
              )}
            </p>
          )}

          <div className={clsx(styles.contentDescription, styles.scrollbar)}>
            <p>{description || "Описание навыка не добавлено"}</p>
          </div>

          <div className={styles.btnClamp}>
            {showEditButtons ? (
              <div className={stylesModal.containerModalButton}>
                {onEdit && (
                  <Button
                    variant={"secondary"}
                    rightIcon={<EditIcon />}
                    onClick={onEdit}
                  >
                    Редактировать
                  </Button>
                )}
                {onConfirm && (
                  <Button onClick={onConfirm}>
                    {variant === "modalOffer" ? "Готово" : "Сохранить"}
                  </Button>
                )}
              </div>
            ) : isUserProfile ? (
              // Кнопка "Предложить обмен" или "Обмен предложен"
              onExchange && (
                <Button
                  onClick={onExchange}
                  disabled={isExchangeProposed}
                  variant={isExchangeProposed ? "secondary" : "primary"}
                >
                  {isExchangeProposed ? "Обмен предложен" : "Предложить обмен"}
                </Button>
              )
            ) : null}
          </div>
        </div>

        <div className={styles.imageContainer}>
          {isUserProfile && !isEditable && (
            <div className={styles.containerDecorButtons}>
              <DecoratedButton variant={"heart"} />
              <DecoratedButton variant={"share"} />
              <DecoratedButton variant={"parameters"} />
            </div>
          )}

          <ImagesCarousel images={images} />
        </div>
      </div>
    </div>
  );
};
