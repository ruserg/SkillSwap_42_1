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
import { Input } from "@shared/ui/Input/Input";
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

export const SignupStepOne = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSubmitting = useAppSelector(selectIsSubmitting);

  // Получаем сохраненные данные из Redux
  const { step1 } = useAppSelector(selectSignup);

  // Инициализируем форму данными из Redux
  const [formData, setFormData] = useState<SignupStep1Data>({
    email: step1.email || "",
    password: step1.password || "",
  });

  // Если данные уже есть (возврат на шаг 1), помечаем поля как touched
  const [touched, setTouched] = useState({
    email: !!(step1.email && step1.email.length > 0),
    password: !!(step1.password && step1.password.length > 0),
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [isFormValid, setIsFormValid] = useState(false);
  const [emailAvailability, setEmailAvailability] = useState<boolean | null>(
    null,
  );

  // Debounce email для проверки на сервере
  const debouncedEmail = useDebounce(formData.email, 500);

  // Проверка email на сервере
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

  // При монтировании, если email уже заполнен, запускаем проверку
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
  }, []); // Только при монтировании компонента

  // Валидация при каждом изменении формы
  useEffect(() => {
    const result = signupStep1Schema.safeParse(formData);
    const newErrors: { email?: string; password?: string } = {};

    // Шаг 1: Проверяем формат email
    if (touched.email) {
      const emailIssue = result.error?.issues.find(
        (issue) => issue.path[0] === "email",
      );
      if (emailIssue) {
        // Формат невалиден - показываем ошибку формата
        newErrors.email = emailIssue.message;
      } else if (emailAvailability === false) {
        // Шаг 2: Формат валиден, но email занят
        newErrors.email = "Email уже занят";
      }
      // Если emailAvailability === null - значит проверка идет, не показываем ошибку
      // Если emailAvailability === true - email свободен, ошибки нет
    }

    // Шаг 3: Проверяем пароль ТОЛЬКО если email полностью валиден (формат + свободен)
    if (touched.password) {
      const emailIssue = result.error?.issues.find(
        (issue) => issue.path[0] === "email",
      );
      // Пароль проверяем только если email валиден по формату И свободен
      const isEmailFullyValid = !emailIssue && emailAvailability === true;

      if (isEmailFullyValid) {
        const passwordIssue = result.error?.issues.find(
          (issue) => issue.path[0] === "password",
        );
        if (passwordIssue) {
          newErrors.password = passwordIssue.message;
        }
      }
    }

    setErrors(newErrors);

    // Форма валидна только если схема валидна и email доступен
    setIsFormValid(result.success && emailAvailability === true);
  }, [formData, touched, emailAvailability]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    setTouched((prev) => ({ ...prev, [id]: true }));

    // Сбрасываем доступность email при изменении, чтобы не показывать старый результат
    if (id === "email") {
      setEmailAvailability(null);
    }
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
              onChange={handleInputChange}
              error={errors.email}
            />
            {/* // TODO: в компоненте инпута нужно сделать кнопку "показать пароль" */}
            <FormField
              label="Пароль"
              id="password"
              type="password"
              placeholder="Придумайте надёжный пароль"
              value={formData.password}
              onChange={handleInputChange}
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
