import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { updateStep1, selectSignup } from "@features/signup/model/slice";
import { useNavigate } from "react-router-dom";
import styles from "./signupStepOne.module.scss";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import { Logo } from "@shared/ui/Logo/Logo";
import lightBulb from "@images/png/light-bulb.png";
import { SignupSteps } from "@shared/ui/SignupSteps/SignupSteps";
import { ArrowLeftIcon } from "@shared/ui/Icons/ArrowLeftIcon";
import { useEffect, useState } from "react";
import type { z } from "zod";
import type { SignupStep1Data } from "@shared/lib/zod/types";
import { signupStep1Schema } from "@shared/lib/zod/schemas/userAuthSchema";
import { ExternalLogIn } from "@/widgets/ExternalLogIn/ExternalLogIn";
import { WelcomeSection } from "@shared/ui/WelcomeSection/WelcomeSection.tsx";

export const SignupStepOne = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Получаем сохраненные данные из Redux
  const { step1 } = useAppSelector(selectSignup);

  // Инициализируем форму данными из Redux
  const [formData, setFormData] = useState<SignupStep1Data>({
    email: step1.email || "",
    password: step1.password || "",
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

      result.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as keyof SignupStep1Data;
        if (
          field &&
          touched[field as keyof typeof touched] &&
          (field === "email" || field === "password")
        ) {
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

  const handleSubmit = () => {
    if (isFormValid) {
      // Сохраняем данные шага 1 в Redux
      dispatch(
        updateStep1({
          email: formData.email,
          password: formData.password,
        }),
      );
      navigate("/registration/step2");
    }
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
          <ExternalLogIn />
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
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

            <Button onClick={handleSubmit} disabled={!isFormValid}>
              Далее
            </Button>
          </form>
        </div>
        <WelcomeSection
          src={lightBulb}
          alt={"Картинка с нарисованной лампочкой"}
          title={"Добро пожаловать в SkillSwap!"}
          description={
            "Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми"
          }
        />
      </section>
    </>
  );
};
