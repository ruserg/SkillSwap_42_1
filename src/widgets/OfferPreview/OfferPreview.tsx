import styles from "./offerPreview.module.scss";
import stylesModal from "./offerPreviewModal.module.scss";
import clsx from "clsx";
import { DecoratedButton } from "@shared/ui/DecoratedButton/DecoratedButton";
import { ImagesCarousel } from "@widgets/ImagesCarousel/ImagesCarousel";
import { Button } from "@shared/ui/Button/Button";
import { EditIcon } from "@shared/ui/Icons/EditIcon";
import type { TOfferProps } from "@widgets/OfferPreview/types";

export const OfferPreview = (props: TOfferProps) => {
  const {
    variant = "userProfileOffer",
    isEmpty = false,
    skillName = "",
    categoryName = "",
    subcategoryName = "",
    description = "",
    images = [],
    onEdit,
    onDelete,
    onConfirm,
    onExchange,
    isExchangeProposed = false,
    exchangeStatus,
  } = props;

  if (variant === "userProfileOffer" && isEmpty) {
    return (
      <div className={stylesModal.wrapper}>
        <div className={styles.contentContainer}>
          <div className={styles.previewDescription}>
            <h2 className={styles.contentTittle}>Навык не указан</h2>

            <p className={styles.contentDescription}>
              Пользователь пока не добавил предложения
            </p>

            <div className={styles.btnClamp}>
              <Button disabled>Предложить обмен</Button>
            </div>
          </div>

          <div className={styles.cardsContainer}>
            <div className={styles.imageBlock}>
              <div className={styles.containerDecorButtons}>
                <DecoratedButton variant="heart" />
                <DecoratedButton variant="share" />
                <DecoratedButton variant="parameters" />
              </div>

              {images.length > 0 ? (
                <ImagesCarousel images={images} />
              ) : (
                <div className={styles.noImages}>
                  Нет загруженных изображений
                  <p className={styles.noImagesHint}>
                    Добавьте изображения, чтобы показать ваш навык
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={stylesModal.wrapper}>
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
              {skillName || "Название навыка не указано"}
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

            {description && (
              <p className={clsx(styles.contentDescription, styles.scrollbar)}>
                {description}
              </p>
            )}

            <div className={styles.btnClamp}>
              {variant === "modalOffer" && (
                <div className={stylesModal.containerModalButton}>
                  <Button
                    variant={"secondary"}
                    rightIcon={<EditIcon />}
                    onClick={onEdit}
                  >
                    {"Редактировать"}
                  </Button>
                  <Button onClick={onConfirm}>{"Готово"}</Button>
                </div>
              )}

              {variant === "mySkills" && (
                <div className={styles.skillActions}>
                  <Button rightIcon={<EditIcon />} onClick={onEdit}>
                    {"Редактировать"}
                  </Button>
                  {onDelete && (
                    <Button
                      variant="secondary"
                      onClick={onDelete}
                      style={{ color: "var(--color-error)" }}
                    >
                      {"Удалить"}
                    </Button>
                  )}
                </div>
              )}

              {variant === "userProfileOffer" && (
                <Button onClick={onExchange} disabled={isExchangeProposed}>
                  {exchangeStatus === "accepted"
                    ? "Обмен подтвержден"
                    : exchangeStatus === "pending"
                      ? "Обмен предложен"
                      : "Предложить обмен"}
                </Button>
              )}
            </div>
          </div>

          <div className={clsx(styles.cardsContainer)}>
            {variant === "userProfileOffer" && (
              <div className={styles.containerDecorButtons}>
                <DecoratedButton variant="heart" />
                <DecoratedButton variant="share" />
                <DecoratedButton variant="parameters" />
              </div>
            )}
            <ImagesCarousel images={images} />
          </div>
        </div>
      </div>
    </>
  );
};
