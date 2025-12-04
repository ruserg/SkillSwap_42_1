import styles from "./signupStepOne.module.scss";
import { Button } from "../../../../shared/ui/Button";
import { Separator } from "../../../../shared/ui/Separator";
import { Input } from "../../../../shared/ui/Input";
import { Logo } from "@shared/ui/Logo/Logo";
import lightBulb from "../../../../images/png/light-bulb.png";
import { AppleIcon } from "@shared/ui/Icons/AppleIcon";
import { SignupSteps } from "../../../../shared/ui/SignupSteps";
import { ArrowLeftIcon } from "@shared/ui/Icons/ArrowLeftIcon";
import { GoogleIcon } from "@shared/ui/Icons/GoogleIcon";
import { useEffect, useState } from "react";
import type { SignupStep1Data } from "@/shared/lib/zod";
import { signupStep1Schema } from "@/shared/lib/zod/schemas/userAuthSchema";

export const SignupStepOne = () => {
  const [formData, setFormData] = useState<SignupStep1Data>({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [isFormValid, setIsFormValid] = useState(false);

  // Валидация при каждом изменении формы
  useEffect(() => {
    const result = signupStep1Schema.safeParse(formData);

    if (result.success) {
      setErrors({});
      setIsFormValid(true);
    } else {
      const newErrors: { email?: string; password?: string } = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignupStep1Data;
        if (touched[field]) {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);
      setIsFormValid(false);
    }
  }, [formData, touched]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    setTouched((prev) => ({ ...prev, [id]: true }));
  };

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
              <Input
                type="email"
                id="email"
                placeholder="Введите email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div className={styles.passwordContainer}>
              <label htmlFor="password">Пароль</label>
              {/* // TODO: в компоненте инпута нужно сделать кнопку "показать пароль" */}
              <Input
                type="password"
                id="password"
                placeholder="Придумайте надёжный пароль"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
            </div>

            <Button disabled={!isFormValid}>Далее</Button>
          </form>
        </div>
        <div className={styles.welcomeContainer}>
          <img
            className={styles.lightBulb}
            src={lightBulb}
            alt="Картинка с нарисованной лампочкой"
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
