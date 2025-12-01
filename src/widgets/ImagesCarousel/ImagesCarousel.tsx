import styles from "./imagesCarousel.module.scss";
import clsx from "clsx";
import { useState } from "react";

/*временные мок карточки*/
export const images = [
  {
    url: "https://i.pinimg.com/1200x/fc/7e/9b/fc7e9b55365f34214c4e7d6307e4d2f5.jpg",
    description: "MaoMao & Frieren",
  },
  {
    url: "https://i.pinimg.com/1200x/5a/79/ab/5a79abcb9628199323e08cc29b697910.jpg",
    description: "MaoMao & Frieren",
  },
  {
    url: "https://i.pinimg.com/1200x/a7/09/e4/a709e4fa3f27392989ca46f65aad6771.jpg",
    description: "MaoMao & Frieren",
  },
  {
    url: "https://i.pinimg.com/736x/19/6c/05/196c0594228cf909e0877b525c8c6602.jpg",
    description: "MaoMao & Frieren",
  },
  {
    url: "https://i.pinimg.com/1200x/bd/8b/1c/bd8b1cff3658ce3d9016650385f0ff36.jpg",
    description: "MaoMao & Frieren",
  },
  {
    url: "https://i.pinimg.com/736x/2b/c8/f2/2bc8f287a5668b6cd4e786f088b9f09a.jpg",
    description: "MaoMao & Frieren",
  },
  {
    url: "https://i.pinimg.com/736x/2b/c8/f2/2bc8f287a5668b6cd4e786f088b9f09a.jpg",
    description: "MaoMao & Frieren",
  },
  {
    url: "https://i.pinimg.com/736x/2b/c8/f2/2bc8f287a5668b6cd4e786f088b9f09a.jpg",
    description: "MaoMao & Frieren",
  },
];
/*временные мок карточки*/

export const ImagesCarousel = () => {
  const visible = 4;

  const [visibleCards, setVisibleCards] = useState(images.slice(0, visible));

  const mainCard = visibleCards[0];
  const otherCards = visibleCards.slice(1);

  const handleSwapRight = () => {
    setVisibleCards((prev) => [...prev.slice(1), prev[0]]);
  };

  const handleSwapLeft = () => {
    setVisibleCards((prev) => [
      prev[prev.length - 1],
      ...prev.slice(0, prev.length - 1),
    ]);
  };

  return (
    <>
      <div className={clsx(styles.cardsContainer)}>
        <div className={styles.cardsSwiper}>
          <button
            className={clsx(styles.buttonSwap, styles.left)}
            onClick={handleSwapLeft}
          ></button>

          {mainCard && (
            <img
              src={mainCard.url}
              className={styles.mainCard}
              alt={mainCard.description}
            />
          )}
          {otherCards.map((card, index) => {
            const isLast = index === otherCards.length - 1;
            const hiddenCount = images.length - visibleCards.length;

            return (
              <div className={styles.wrapperCards} key={index}>
                <img
                  src={card.url}
                  className={clsx(
                    styles.otherCard,
                    isLast && styles.overlayCard,
                  )}
                  alt={card.description}
                />
                {isLast && hiddenCount > 0 && (
                  <div className={styles.overlayCount}>
                    +{hiddenCount}{" "}
                    {/*показывает постоянное число не видных карточек на странице*/}
                  </div>
                )}
              </div>
            ); // Когда будут готовы мокки, поменять key
          })}
          <button
            className={clsx(styles.buttonSwap, styles.right)}
            onClick={handleSwapRight}
          ></button>
        </div>
      </div>
    </>
  );
};
