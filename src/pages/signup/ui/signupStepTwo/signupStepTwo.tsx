import styles from "./signupStepTwo.module.scss";
import { Button } from "../../../../shared/ui/button";
import { Input } from "../../../../shared/ui/input";
import { Logo } from "../../../../shared/ui/logo/logo.tsx";
import userInfo from "../../../../images/png/user-info.png";
import userCircle from "../../../../images/icons/user-circle.svg";
import add from "../../../../images/icons/add.svg";
import { SignupSteps } from "../../../../shared/ui/signupSteps";
import { ArrowLeftIcon } from "../../../../shared/ui/icons/arrowLeftIcon.tsx";
import { Selector } from "@/shared/ui/selector/selector.tsx";
import clsx from "clsx";

export const SignupStepTwo = () => {
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
              alt="картинка человеком"
              loading="lazy"
            />
            {/* // TODO: значок плюс не соответсвует макету */}
            <img
              className={styles.add}
              src={add}
              alt="знак плюс"
              loading="lazy"
            />
          </div>
          <form className={clsx(styles.form)}>
            <div className={clsx(styles.nameContainer, styles.container)}>
              <label htmlFor="name">Имя</label>
              <Input type="text" id="name" placeholder="Введите ваше имя" />
            </div>

            <div className={clsx(styles.containerWrapper)}>
              {/* // TODO: поменять цвет шрифта placeholder и иконку календаря */}
              <div className={clsx(styles.container)}>
                <label htmlFor="date">Дата рождения</label>
                <Input type="date" id="date" placeholder="дд.мм.гггг" />
              </div>

              <div className={clsx(styles.container)}>
                <Selector
                  selectionTitle={"Пол"}
                  selectionPlaceholder={"Не указан"}
                  selectionOptions={["Не указан", "Мужской", "Женский"]}
                  selectorType={"radio"}
                />
              </div>
            </div>

            <div className={clsx(styles.container)}>
              <Selector
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
