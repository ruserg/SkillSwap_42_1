import React, { useState, useEffect, useRef } from "react";
import styles from "./imagesCarousel.module.scss";
import clsx from "clsx";

interface ImagesCarouselProps {
  images?: string[]; // Массив URL изображений (может быть base64 или внешние URL)
  visibleCount?: number; // Количество видимых карточек
  onImageClick?: (index: number) => void;
  carouselLabel?: string;
  imageDescriptions?: string[];
}

export const ImagesCarousel: React.FC<ImagesCarouselProps> = ({
  images = [],
  visibleCount = 4,
  onImageClick,
  carouselLabel = "Карусель изображений",
  imageDescriptions = [],
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  // announcement - состояние для объявления скринридерам, там будет лежать например "Изображение 2 из 5"
  const [announcement, setAnnouncement] = useState("");
  const announcementRef = useRef<HTMLDivElement>(null);

  const imagesKey = JSON.stringify(images);

  useEffect(() => {
    let validImages: string[] = [];

    if (images && images.length > 0) {
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
  }, [imagesKey]);

  // хук с таймером, чтобы очистить обхявление после 1 секунды показа, чтобы скринридер прочитал его только 1 раз
  useEffect(() => {
    if (announcement && announcementRef.current) {
      const timer = setTimeout(() => {
        setAnnouncement("");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [announcement]);

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
  const canNavigate = processedImages.length > 1;

  const handleNext = () => {
    if (!canNavigate) return;
    const newIndex = (currentIndex + 1) % processedImages.length;
    setCurrentIndex(newIndex);
    setAnnouncement(`Изображение ${newIndex + 1} из ${processedImages.length}`);
  };

  const handlePrev = () => {
    if (!canNavigate) return;
    const newIndex =
      (currentIndex - 1 + processedImages.length) % processedImages.length;
    setCurrentIndex(newIndex);
    setAnnouncement(`Изображение ${newIndex + 1} из ${processedImages.length}`);
  };

  const handleImageClick = (index: number) => {
    if (onImageClick) {
      onImageClick(index);
    }
  };

  const getImageAlt = (index: number): string => {
    if (imageDescriptions[index]) {
      return imageDescriptions[index];
    }

    const imageNumber = index + 1;
    const totalImages = processedImages.length;

    if (index === currentIndex) {
      return `Основное изображение ${imageNumber} из ${totalImages}`;
    }

    return `Изображение ${imageNumber} из ${totalImages}`;
  };

  const getImageAriaLabel = (index: number): string => {
    const imageNumber = index + 1;
    const totalImages = processedImages.length;
    const isMain = index === currentIndex;

    if (isMain) {
      return `Основное изображение ${imageNumber} из ${totalImages}. ${getImageAlt(index)}. Для просмотра нажмите Enter или пробел.`;
    }

    return `Изображение ${imageNumber} из ${totalImages}. ${getImageAlt(index)}. Для просмотра нажмите Enter или пробел.`;
  };

  const isValidBase64 = (str: string): boolean => {
    if (!str.startsWith("data:image")) return false;
    try {
      const base64Data = str.split(",")[1];
      if (!base64Data) return false;

      if (base64Data.length < 100) return false;

      atob(base64Data);
      return true;
    } catch {
      return false;
    }
  };

  const handleImageError = (
    index: number,
    e: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    console.error(`Ошибка загрузки изображения ${index}`, e);
    // Можно установить placeholder изображение
    e.currentTarget.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='sans-serif' font-size='12'%3EИзображение%3C/text%3E%3C/svg%3E";
    e.currentTarget.alt = `Не удалось загрузить изображение ${index + 1}`; // Обновление alt при ошибке
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        handlePrev();
        break;
      case "ArrowRight":
        e.preventDefault();
        handleNext();
        break;
      case "Home":
        e.preventDefault();
        setCurrentIndex(0);
        setAnnouncement(`Изображение 1 из ${processedImages.length}`);
        break;
      case "End":
        e.preventDefault();
        setCurrentIndex(processedImages.length - 1);
        setAnnouncement(
          `Изображение ${processedImages.length} из ${processedImages.length}`,
        );
        break;
    }
  };

  if (!hasImages) {
    return (
      <div className={styles.cardsContainer}>
        <div
          className={styles.noImages}
          role="region"
          aria-label={carouselLabel}
        >
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
    <div
      className={styles.cardsContainer}
      role="region"
      aria-label={carouselLabel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-roledescription="карусель"
    >
      {/*Скрытый элемент для объявлений скринридерам */}
      <div
        ref={announcementRef}
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      >
        {announcement}
      </div>
      <div className={styles.cardsSwiper}>
        {canNavigate && (
          <button
            className={clsx(styles.buttonSwap, styles.left)}
            onClick={handlePrev}
            aria-label="Предыдущее изображение"
            aria-controls="carousel-images"
            type="button"
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
                handlePrev();
              }
            }}
          />
        )}

        {mainImage && (
          <div
            className={styles.mainImageContainer}
            onClick={() => handleImageClick(mainImage.index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleImageClick(mainImage.index);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={getImageAriaLabel(mainImage.index)}
            aria-describedby={`image-desc-${mainImage.index}`}
          >
            <img
              src={mainImage.url}
              className={styles.mainCard}
              alt={getImageAlt(mainImage.index)}
              loading="lazy"
              onError={(e) => handleImageError(mainImage.index, e)}
              crossOrigin="anonymous"
              id={`carousel-image-${mainImage.index}`}
            />
            {/*Скрытое описание для скринридеров */}
            <div id={`image-desc-${mainImage.index}`} className={styles.srOnly}>
              {`Изображение ${mainImage.index + 1} из ${processedImages.length}. ${getImageAlt(mainImage.index)}`}
            </div>
          </div>
        )}

        <div
          className={styles.thumbnailsContainer}
          aria-label="Миниатюры изображений"
          role="group"
        >
          {otherImages.map((img, idx) => {
            const isLastThumbnail =
              idx === otherImages.length - 1 && hiddenCount > 0;

            return (
              <div
                className={styles.thumbnailWrapper}
                key={idx}
                onClick={() => handleImageClick(img.index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleImageClick(img.index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={getImageAriaLabel(img.index)}
                aria-describedby={`image-desc-${img.index}`}
              >
                <img
                  src={img.url}
                  className={clsx(
                    styles.thumbnail,
                    isLastThumbnail && styles.thumbnailWithOverlay,
                  )}
                  alt={getImageAlt(img.index)}
                  loading="lazy"
                  onError={(e) => handleImageError(img.index, e)}
                  crossOrigin="anonymous"
                  id={`thumbnail-${img.index}`}
                />
                {isLastThumbnail && hiddenCount > 0 && (
                  <div className={styles.overlayCount} aria-hidden="true">
                    +{hiddenCount}
                  </div>
                )}
                {/* Скрытое описание для скринридеров */}
                <div id={`image-desc-${img.index}`} className={styles.srOnly}>
                  {`Миниатюра изображения ${img.index + 1} из ${processedImages.length}. ${getImageAlt(img.index)}`}
                </div>
              </div>
            );
          })}

          {/* Заполнители если картинок меньше visibleCount */}
          {visibleImages.length < visibleCount &&
            Array.from({ length: visibleCount - visibleImages.length }).map(
              (_, idx) => (
                <div
                  className={styles.thumbnailWrapper}
                  key={`empty-${idx}`}
                  aria-hidden="true"
                >
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
            aria-controls="carousel-images"
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
                handleNext();
              }
            }}
          />
        )}
      </div>
      {/* Индикатор прогресса для скринридеров */}
      <div className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {`Изображение ${currentIndex + 1} из ${processedImages.length}`}
      </div>
    </div>
  );
};
