import React from "react";
import clsx from "clsx";
import styles from "./OfferPreviewFormData.module.scss";
import { Button } from "@shared/ui/Button/Button";
import editIcon from "@images/icons/edit.svg";

interface OfferPreviewFormDataProps {
  skillName: string;
  categoryName: string;
  subcategoryName: string;
  description: string;
  images: string[];
  onEdit?: () => void;
  onConfirm?: () => void;
}

export const OfferPreviewFormData: React.FC<OfferPreviewFormDataProps> = ({
  skillName,
  categoryName,
  subcategoryName,
  description,
  images,
  onEdit,
  onConfirm,
}) => {
  const displayImages = images.slice(0, 4);
  const extraImagesCount = images.length > 4 ? images.length - 4 : 0;

  return (
    <div className={styles.previewWrapper}>
      <div className={styles.contentContainer}>
        {/* Первая колонка: название, категория, описание, кнопки */}
        <div className={styles.leftColumn}>
          <div className={styles.previewDescription}>
            <h2 className={styles.contentTittle}>
              {skillName || "Название навыка"}
            </h2>
            <p className={styles.contentContainerSubtitle}>
              <span className={clsx(styles.category, styles.mainCategory)}>
                {categoryName || "Категория"}
              </span>
              {" / "}
              <span className={clsx(styles.category, styles.subCategory)}>
                {subcategoryName || "Подкатегория"}
              </span>
            </p>

            <div className={clsx(styles.contentDescription)}>
              {description || "Описание навыка"}
            </div>
          </div>

          {/* Кнопки */}
          <div className={styles.buttonsContainer}>
            <div className={styles.buttonWrapper}>
              <Button
                variant="secondary"
                onClick={onEdit}
                rightIcon={
                  <img
                    src={editIcon}
                    alt="Редактировать"
                    className={styles.editIcon}
                  />
                }
              >
                Редактировать
              </Button>
            </div>
            <div className={styles.buttonWrapper}>
              <Button onClick={onConfirm}>Готово</Button>
            </div>
          </div>
        </div>

        {/* Вторая колонка: картинки */}
        <div className={styles.rightColumn}>
          <div className={styles.imageContainer}>
            {images.length > 0 ? (
              <div className={styles.imagesGrid}>
                {/* Главное изображение (первое) */}
                <img
                  src={displayImages[0]}
                  alt="Главное изображение"
                  className={styles.mainImage}
                />

                {/* Миниатюры (2-4 картинки) */}
                <div className={styles.thumbnails}>
                  {displayImages.slice(1).map((img, index) => {
                    const isLastThumbnail = index === 2 && extraImagesCount > 0;

                    return (
                      <div key={index} className={styles.thumbnailWrapper}>
                        <img
                          src={img}
                          alt={`Миниатюра ${index + 1}`}
                          className={
                            isLastThumbnail
                              ? styles.thumbnailWithOverlay
                              : styles.thumbnail
                          }
                        />
                        {isLastThumbnail && (
                          <div className={styles.moreImages}>
                            +{extraImagesCount}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Заполнитель если картинок меньше 4 */}
                  {displayImages.length < 4 &&
                    [...Array(4 - displayImages.length)].map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className={styles.thumbnailWrapper}
                      >
                        <div className={styles.noThumbnail}>Пусто</div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className={styles.noImages}>Нет загруженных изображений</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
