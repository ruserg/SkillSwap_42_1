import React, { useState, useEffect } from "react";
import styles from "./imagesCarousel.module.scss";
import clsx from "clsx";

interface ImagesCarouselProps {
  images?: string[]; // Массив URL изображений (может быть base64 или внешние URL)
  visibleCount?: number; // Количество видимых карточек
  onImageClick?: (index: number) => void;
}

export const ImagesCarousel: React.FC<ImagesCarouselProps> = ({
  images = [],
  visibleCount = 4,
  onImageClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processedImages, setProcessedImages] = useState<string[]>([]);

  const imagesKey = JSON.stringify(images);

  // Обрабатываем изображения (фильтруем невалидные)
  useEffect(() => {
    let validImages: string[] = [];

    if (images && images.length > 0) {
      // Фильтруем пустые строки и null/undefined
      validImages = images.filter(
        (img) =>
          img &&
          typeof img === "string" &&
          (img.startsWith("http") ||
            img.startsWith("data:image") ||
            img.startsWith("https") ||
            img.trim() !== ""),
      );
    }

    setProcessedImages(validImages);
    setCurrentIndex(0);
  }, [imagesKey]);  // Получаем видимые изображения
  const getVisibleImages = () => {
    if (processedImages.length === 0) return [];

    const result = [];
    for (let i = 0; i < Math.min(visibleCount, processedImages.length); i++) {
      const index = (currentIndex + i) % processedImages.length;
      result.push({
        url: processedImages[index],
        index: index,
        isMain: i === 0,
      });
    }
    return result;
  };

  const visibleImages = getVisibleImages();
  const hasImages = processedImages.length > 0;
  const canNavigate = processedImages.length > visibleCount;

  const handleNext = () => {
    if (!canNavigate) return;
    setCurrentIndex((prev) => (prev + 1) % processedImages.length);
  };

  const handlePrev = () => {
    if (!canNavigate) return;
    setCurrentIndex(
      (prev) => (prev - 1 + processedImages.length) % processedImages.length,
    );
  };

  const handleImageClick = (index: number) => {
    if (onImageClick) {
      onImageClick(index);
    }
  };

  // Функция для проверки Base64 изображений
  const isValidBase64 = (str: string): boolean => {
    if (!str.startsWith("data:image")) return false;
    try {
      // Проверяем формат Base64
      const base64Data = str.split(",")[1];
      if (!base64Data) return false;

      // Проверяем длину (минимальная длина для валидного изображения)
      if (base64Data.length < 100) return false;

      // Попробуем декодировать
      atob(base64Data);
      return true;
    } catch {
      return false;
    }
  };

  // Функция для обработки ошибок загрузки изображений
  const handleImageError = (
    index: number,
    e: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    console.error(`Ошибка загрузки изображения ${index}`, e);
    // Можно установить placeholder изображение
    e.currentTarget.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='sans-serif' font-size='12'%3EИзображение%3C/text%3E%3C/svg%3E";
  };

  if (!hasImages) {
    return (
      <div className={styles.cardsContainer}>
        <div className={styles.noImages}>
          Нет загруженных изображений
          <p className={styles.noImagesHint}>
            Добавьте изображения, чтобы показать ваш навык
          </p>
        </div>
      </div>
    );
  }

  const mainImage = visibleImages[0];
  const otherImages = visibleImages.slice(1);
  const hiddenCount = Math.max(0, processedImages.length - visibleCount);

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.cardsSwiper}>
        {canNavigate && (
          <button
            className={clsx(styles.buttonSwap, styles.left)}
            onClick={handlePrev}
            aria-label="Предыдущее изображение"
            type="button"
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
              onError={(e) => handleImageError(mainImage.index, e)}
              crossOrigin="anonymous"
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
                  onError={(e) => handleImageError(img.index, e)}
                  crossOrigin="anonymous"
                />
                {isLastThumbnail && hiddenCount > 0 && (
                  <div className={styles.overlayCount}>+{hiddenCount}</div>
                )}
              </div>
            );
          })}

          {/* Заполнители если картинок меньше visibleCount */}
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
            type="button"
          />
        )}
      </div>
    </div>
  );
};
