import React, { useState, useCallback } from "react";
import styles from "./imagesCarousel.module.scss";
import clsx from "clsx";

interface ImagesCarouselProps {
  images?: string[];
  visibleCount?: number;
  onImageClick?: (index: number) => void;
}

export const ImagesCarousel: React.FC<ImagesCarouselProps> = ({
  images = [],
  visibleCount = 4,
  onImageClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getVisibleImages = useCallback(() => {
    if (images.length === 0) return [];

    const result = [];
    for (let i = 0; i < Math.min(visibleCount, images.length); i++) {
      const index = (currentIndex + i) % images.length;
      result.push({
        url: images[index],
        index: index,
        isMain: i === 0,
      });
    }
    return result;
  }, [images, currentIndex, visibleCount]);

  const visibleImages = getVisibleImages();
  const hasImages = images.length > 0;
  const canNavigate = images.length > visibleCount;

  const handleNext = () => {
    if (!canNavigate) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (!canNavigate) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageClick = (index: number) => {
    if (onImageClick) {
      onImageClick(index);
    }
  };

  if (!hasImages) {
    return (
      <div className={styles.cardsContainer}>
        <div className={styles.noImages}>Нет загруженных изображений</div>
      </div>
    );
  }

  const mainImage = visibleImages[0];
  const otherImages = visibleImages.slice(1);
  const hiddenCount = Math.max(0, images.length - visibleCount);

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.cardsSwiper}>
        {canNavigate && (
          <button
            className={clsx(styles.buttonSwap, styles.left)}
            onClick={handlePrev}
            aria-label="Предыдущее изображение"
          />
        )}

        {mainImage && (
          <div
            className={styles.mainImageContainer}
            onClick={() => handleImageClick(mainImage.index)}
          >
            <img
              src={mainImage.url}
              className={styles.mainCard}
              alt="Главное изображение"
              loading="lazy"
            />
          </div>
        )}

        <div className={styles.thumbnailsContainer}>
          {otherImages.map((img, idx) => {
            const isLastThumbnail =
              idx === otherImages.length - 1 && hiddenCount > 0;

            return (
              <div
                className={styles.thumbnailWrapper}
                key={idx}
                onClick={() => handleImageClick(img.index)}
              >
                <img
                  src={img.url}
                  className={clsx(
                    styles.thumbnail,
                    isLastThumbnail && styles.thumbnailWithOverlay,
                  )}
                  alt={`Изображение ${idx + 2}`}
                  loading="lazy"
                />
                {isLastThumbnail && hiddenCount > 0 && (
                  <div className={styles.overlayCount}>+{hiddenCount}</div>
                )}
              </div>
            );
          })}

          {visibleImages.length < visibleCount &&
            Array.from({ length: visibleCount - visibleImages.length }).map(
              (_, idx) => (
                <div className={styles.thumbnailWrapper} key={`empty-${idx}`}>
                  <div className={styles.noThumbnail}>Пусто</div>
                </div>
              ),
            )}
        </div>

        {canNavigate && (
          <button
            className={clsx(styles.buttonSwap, styles.right)}
            onClick={handleNext}
            aria-label="Следующее изображение"
          />
        )}
      </div>
    </div>
  );
};
