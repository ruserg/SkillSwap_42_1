import styles from "./signupStepOne.module.scss";
import { Button } from "@shared/ui/Button/Button";
import { Separator } from "@shared/ui/Separator/Separator";
import { Input } from "@shared/ui/Input/Input.tsx";
import { Logo } from "@shared/ui/Logo/Logo";
import lightBulb from "../../../../images/png/light-bulb.png";
import { AppleIcon } from "@shared/ui/Icons/AppleIcon";
import { SignupSteps } from "@shared/ui/SignupSteps";
import { ArrowLeftIcon } from "@shared/ui/Icons/ArrowLeftIcon";
import { GoogleIcon } from "@shared/ui/Icons/GoogleIcon";

export const SignupStepOne = () => {
  return (
    <>
      <div className={styles.logo}>
        <Logo />
        <div className={styles.backButtonContainer}>
          <Button to="/" variant={"tertiary"} leftIcon={<ArrowLeftIcon />}>
            Назад
          </Button>
        </div>
      </div>
      <div className={styles.steps}>
        <SignupSteps currentStep={1} />
      </div>
      <section className={styles.section}>
        <div className={styles.registerContainer}>
          <Button variant="signup" leftIcon={<GoogleIcon />}>
            Продолжить с Google
          </Button>
          <Button variant="signup" leftIcon={<AppleIcon />}>
            Продолжить с Apple
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
