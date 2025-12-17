import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import {
  updateStep1,
  selectSignup,
  selectIsSubmitting,
} from "@features/signup/model/slice";
import { useNavigate } from "react-router-dom";
import styles from "./signupStepOne.module.scss";
import formStyles from "@shared/ui/Form/form.module.scss";
import { Button } from "@shared/ui/Button/Button";
import { Logo } from "@shared/ui/Logo/Logo";
import lightBulb from "@images/png/light/light-bulb.png";
import { SignupSteps } from "@shared/ui/SignupSteps/SignupSteps";
import { ArrowLeftIcon } from "@shared/ui/Icons/ArrowLeftIcon";
import { useEffect, useState } from "react";
import type { SignupStep1Data } from "@shared/lib/zod/types";
import { signupStep1Schema } from "@shared/lib/zod/schemas/userAuthSchema";
import { ExternalLogIn } from "@/widgets/ExternalLogIn/ExternalLogIn";
import { WelcomeSection } from "@shared/ui/WelcomeSection/WelcomeSection.tsx";
import { Loader } from "@/shared/ui/Loader/Loader";
import { useDebounce } from "@shared/hooks/useDebounce";
import { api, ApiError } from "@shared/api/api";
import { FormField } from "@/shared/ui/FormField/FormField";
import { useFormValidation } from "@shared/hooks/useFormValidation";

export const SignupStepOne = () => {
  const [emailAvailability, setEmailAvailability] = useState<boolean | null>(
    null,
  );
  const { step1 } = useAppSelector(selectSignup);

  const {
    formData,
    touched,
    errors: baseErrors,
    isFormValid: isZodFormValid,
    handleInputChange,
  } = useFormValidation<SignupStep1Data>({
    schema: signupStep1Schema,
    initialValues: {
      email: step1.email || "",
      password: step1.password || "",
    },
    initialTouched: {
      email: !!step1.email,
      password: !!step1.password,
    },
  });

  const errors = { ...baseErrors };

  if (touched.email && emailAvailability === false) {
    errors.email = "Email уже занят";
  }

  const isFormValid =
    isZodFormValid && (emailAvailability === true || !touched.email);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectIsSubmitting);

  const handleChangeWithEmailReset = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleInputChange(e);

    if (e.target.id === "email") {
      setEmailAvailability(null);
    }
  };

  // Debounce email для проверки на сервере
  const debouncedEmail = useDebounce(formData.email, 500);

  useEffect(() => {
    if (
      debouncedEmail &&
      touched.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail)
    ) {
      api
        .checkEmail(debouncedEmail)
        .then((response) => {
          setEmailAvailability(response.available);
        })
        .catch((error) => {
          if (error instanceof ApiError && error.status >= 500) {
            console.error("Ошибка проверки email:", error);
          }
          setEmailAvailability(null);
        });
    } else {
      setEmailAvailability(null);
    }
  }, [debouncedEmail, touched.email]);

  useEffect(() => {
    if (
      formData.email &&
      touched.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      api
        .checkEmail(formData.email)
        .then((response) => {
          setEmailAvailability(response.available);
        })
        .catch((error) => {
          if (error instanceof ApiError && error.status >= 500) {
            console.error("Ошибка проверки email:", error);
          }
          setEmailAvailability(null);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    if (isFormValid) {
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
    <div className={styles.pageWrapper}>
      {isSubmitting && <Loader />}
      <div className={formStyles.logo}>
        <Logo />
        <div className={formStyles.backButtonContainer}>
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
            <FormField
              label="Email"
              id="email"
              type="email"
              placeholder="Введите email"
              value={formData.email}
              onChange={handleChangeWithEmailReset}
              error={errors.email}
            />
            {/* // TODO: в компоненте инпута нужно сделать кнопку "показать пароль" */}
            <FormField
              label="Пароль"
              id="password"
              type="password"
              placeholder="Придумайте надёжный пароль"
              value={formData.password}
              onChange={handleChangeWithEmailReset}
              error={errors.password}
            />
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
    </div>
  );
};
