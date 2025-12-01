import styles from "./offerPreview.module.scss";
import stylesModal from "./offerPreviewModal.module.scss";
import clsx from "clsx";
import type { TOfferProps } from "./types";
import { ImagesCarousel } from "@widgets/ImagesCarousel/ImagesCarousel";
import { Button } from "@shared/ui/Button";

/*эта карточка меняется в зависимости от variant*/
export const OfferPreview = (props: TOfferProps) => {
  const { variant = "userProfileOffer" } = props;
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
              Зависимый{" "}
              {/*Нужно сделать валидацию на макс. кол-во допустимых символов*/}
            </h2>
            <p className={styles.contentContainerSubtitle}>
              <span className={clsx(styles.category, styles.mainCategory)}>
                Творчество и искусство{" "}
              </span>{" "}
              {/*доп. категория для того, чтоб можно было обратиться к конкретному спану*/}
              /
              <span className={clsx(styles.category, styles.subCategory)}>
                {" "}
                Арт-терапия
              </span>{" "}
              {/*доп. категория для того, чтоб можно было обратиться к конкретному спану*/}
            </p>

            <p className={clsx(styles.contentDescription, styles.scrollbar)}>
              Меня зовут Александр Басов. Мне 30 лет, хотя пытаюсь всем наврать,
              что мне 24 года. Мой дом находится в северо-восточной части
              Башкирии , в районе КБ. Работаю в офисе, в компании "Башкиры не
              чурки, их жизни важны" и домой возвращаюсь, в восемь вечера,
              потому что велосипед сломался, а денег на автобус нет -
              пожертвовал все бедным башкирам. Не курю, выпиваю изредка 2 по 5
              светлого нефильтрованного. Ложусь спать в 4 утра и убеждаюсь, что
              не получаю ровно восемь часов сна, несмотря ни на что. Перед сном
              я пью тёплое пиво, я мазахист, а также минут двадцать уделяю
              Женьку, кажется у на все серьезно, поэтому до утра сплю без особых
              проблем. Утром я просыпаюсь, чувствуя усталость, стресс, словно у
              нас с Женьком уже есть младенец. На медосмотре мне сказали, что
              никаких проблем нет, но мне пришлось заплатить за это наркологу. Я
              пытаюсь донести, что я 100% русский, не башкир, который хочет жить
              спокойной жизнью среди башкиров. Я не забиваю себе голову
              проблемами вроде сегодня пива или вина, и не обзавожусь врагами,
              они меня обходят стороной, впринципе как и все люди из-за моего
              Женька. Я знаю наверняка: в таком способе взаимодействия с
              обществом и кроется счастье - летом Крым, на новый год Допы, в
              остальное время посвящаю себя Женьку. Хотя, если бы обещство
              попыталось нас разлучить, я бы показал истинную мощь Башкирской
              чурки.
            </p>
            <div className={styles.btnClamp}>
              {variant === "modalOffer" && (
                <div className={stylesModal.containerModalButton}>
                  <Button variant={"secondary"}>{"Редактировать"}</Button>
                  <Button>{"Готово"}</Button>
                </div>
              )}

              {variant === "userProfileOffer" && (
                <Button>{"Предложить обмен"}</Button>
              )}
            </div>
          </div>

          <div className={clsx(styles.cardsContainer)}>
            {variant === "userProfileOffer" && (
              <div className={styles.containerDecorButtons}>
                <button className={styles.decorButton}></button>{" "}
                {/*временная заглушка, пока нет декоративных кнопок*/}
                <button className={styles.decorButton}></button>
                <button className={styles.decorButton}></button>
              </div>
            )}
            <ImagesCarousel />
          </div>
        </div>
      </div>
    </>
  );
};
