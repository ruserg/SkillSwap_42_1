import styles from "./signup-step-one.module.scss";
import { Button } from "../../../../shared/ui/button";
import { Separator } from "../../../../shared/ui/separator";
import { Input } from "../../../../shared/ui/input";
import { Logo } from "../../../../shared/ui/logo/logo.tsx";
import lightBulb from "../../../../images/png/light-bulb.png";
import { AppleIcon } from "../../../../shared/ui/icons/appleIcon.tsx";
import { GoogleIcon } from "../../../../shared/ui/icons/googleIcon.tsx";
import { SignupSteps } from "../../../../shared/ui/signup-steps";
import { ArrowLeftIcon } from "../../../../shared/ui/icons/arrowLeftIcon.tsx";

export const SignupStepOne = () => {
  return (
    <>
      <div className={styles.logo}>
        <Logo />
        <div className={styles.backButtonContainer}>
          <Button variant={"tertiary"} leftIcon={<ArrowLeftIcon />}>
            Назад
          </Button>
        </div>
      </div>
      <div className={styles.steps}>
        <SignupSteps currentStep={1} />
      </div>
      <section className={styles.section}>
        <div className={styles.registerContainer}>
          <Button variant="secondary" leftIcon={<GoogleIcon />}>
            Продлжить с Google
          </Button>
          <Button variant="secondary" leftIcon={<AppleIcon />}>
            Продлжить с Apple
          </Button>

          <Separator />

          <form className={styles.form}>
            <div className={styles.emailContainer}>
              <label htmlFor="email">Email</label>
              <Input type="email" id="email" placeholder="Введите email" />
              <span className={styles.errorText}></span>
            </div>

            <div className={styles.passwordContainer}>
              <label htmlFor="password">Пароль</label>
              {/* // TODO: в компоненте инпута нужно сделать кнопку "показать пароль" */}
              <Input
                type="password"
                id="password"
                placeholder="Придумайте надёжный пароль"
              />
              <span className={styles.errorText}>
                Пароль должен содержать не менее 8 знаков
              </span>
            </div>

            <Button>Далее</Button>
          </form>
        </div>
        <div className={styles.welcomeContainer}>
          <img
            className={styles.lightBulb}
            src={lightBulb}
            alt="картинка с нарисованной лампочкой"
            width="300"
            height="300"
            loading="lazy"
          />
          <div className={styles.descriptionContainer}>
            <h3 className={styles.title}>Добро пожаловать в SkillSwap!</h3>
            <p className={styles.description}>
              Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с
              другими людьми
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
