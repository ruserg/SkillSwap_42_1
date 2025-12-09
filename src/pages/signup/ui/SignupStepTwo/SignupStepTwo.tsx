import styles from "./signupStepTwo.module.scss";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import { Logo } from "@shared/ui/Logo/Logo";
import userInfo from "@images/png/user-info.png";
import userCircle from "@shared/assets/images/icons/user-circle.svg";
import add from "@images/icons/add2.svg";
import { SignupSteps } from "@shared/ui/SignupSteps/SignupSteps";
import { ArrowLeftIcon } from "@shared/ui/Icons/ArrowLeftIcon";
import { Selector } from "@shared/ui/Selector/Selector";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export const SignupStepTwo = () => {
  const [openSelectorId, setOpenSelectorId] = useState<string | null>(null);
  const selectorsRef = useRef<HTMLFormElement | null>(null);

  // Для закрытия выпадающего списка при открытии другого
  const handleToggle = (id: string) => {
    setOpenSelectorId((prev) => (prev === id ? null : id));
  };

  // Закрытие выпадающих списков при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openSelectorId &&
        selectorsRef.current &&
        !selectorsRef.current.contains(event.target as Node)
      ) {
        setOpenSelectorId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSelectorId]);

  return (
    <>
      <div className={clsx(styles.logo)}>
        <Logo />
        <div className={clsx(styles.backButtonContainer)}>
          <Button variant={"tertiary"} leftIcon={<ArrowLeftIcon />}>
            Назад
          </Button>
        </div>
      </div>
      <div className={clsx(styles.steps)}>
        <SignupSteps currentStep={2} />
      </div>
      <section className={clsx(styles.section)}>
        <div className={clsx(styles.registerContainer)}>
          <div className={clsx(styles.userWrapper)}>
            <img
              className={styles.userCircle}
              src={userCircle}
              alt="картинка с человеком"
              loading="lazy"
            />
            <img
              className={styles.add}
              src={add}
              alt="знак плюс"
              loading="lazy"
            />
          </div>
          <form ref={selectorsRef} className={clsx(styles.form)}>
            <div className={clsx(styles.nameContainer, styles.container)}>
              <label htmlFor="name">Имя</label>
              <Input type="text" id="name" placeholder="Введите ваше имя" />
            </div>

            <div className={clsx(styles.containerWrapper)}>
              <div className={clsx(styles.container)}>
                <label htmlFor="date">Дата рождения</label>
                <Input type="date" id="date" placeholder="дд.мм.гггг" />
              </div>

              <div className={clsx(styles.container)}>
                <Selector
                  id="gender"
                  isOpen={openSelectorId === "gender"}
                  onToggle={handleToggle}
                  selectionTitle={"Пол"}
                  selectionPlaceholder={"Не указан"}
                  selectionOptions={["Не указан", "Мужской", "Женский"]}
                  selectorType={"radio"}
                />
              </div>
            </div>

            {/* // TODO: поменять selectionOptions на нужные опции */}
            <div className={clsx(styles.container)}>
              <Selector
                id="city"
                isOpen={openSelectorId === "city"}
                onToggle={handleToggle}
                selectionTitle={"Город"}
                selectionPlaceholder={"Не указан"}
                selectionOptions={["Санкт-Петербург", "Самара", "Москва"]}
                selectorType={"radio"}
                enableSearch={true}
              />
            </div>

            {/* // TODO: поменять selectionOptions на нужные опции */}
            <div className={clsx(styles.container)}>
              <Selector
                id="category"
                isOpen={openSelectorId === "category"}
                onToggle={handleToggle}
                selectionTitle={"Категория навыка, которому хотите научиться"}
                selectionPlaceholder={"Выберите категорию"}
                selectionOptions={[
                  "Бизнес и карьера",
                  "Творчество и искусство",
                  "Иностранные языки",
                ]}
                selectorType={"checkbox"}
              />
            </div>

            {/* // TODO: поменять selectionOptions на нужные опции */}
            <div className={clsx(styles.container)}>
              <Selector
                id="subcategory"
                isOpen={openSelectorId === "subcategory"}
                onToggle={handleToggle}
                selectionTitle={
                  "Подкатегория навыка, которому хотите научиться"
                }
                selectionPlaceholder={"Выберите подкатегорию"}
                selectionOptions={[
                  "Рисование и иллюстрация",
                  "Фотография",
                  "Видеомонтаж",
                ]}
                selectorType={"checkbox"}
              />
            </div>

            <div
              className={clsx(styles.containerWrapper, styles.butttonWrapper)}
            >
              <Button variant="secondary">Назад</Button>
              <Button>Продолжить</Button>
            </div>
          </form>
        </div>
        <div className={clsx(styles.welcomeContainer)}>
          <img
            className={styles.userInfo}
            src={userInfo}
            alt="картинка с говорящим человеком"
            loading="lazy"
          />
          <div className={clsx(styles.descriptionContainer)}>
            <h3 className={clsx(styles.title)}>Расскажите немного о себе</h3>
            <p className={clsx(styles.description)}>
              Это поможет другим людям лучше вас узнать, чтобы выбрать для
              обмена
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
