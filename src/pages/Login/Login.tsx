import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { login, selectAuth, clearError } from "@features/auth/model/slice";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import { Logo } from "@shared/ui/Logo/Logo";
import { Separator } from "@shared/ui/Separator/Separator";
import { ArrowLeftIcon } from "@shared/ui/Icons/ArrowLeftIcon";
import { GoogleIcon } from "@shared/ui/Icons/GoogleIcon";
import { AppleIcon } from "@shared/ui/Icons/AppleIcon";
import lightBulb from "@images/png/light-bulb.png";
import type { z } from "zod";
import type { SignupStep1Data } from "@shared/lib/zod/types";
import { signupStep1Schema } from "@shared/lib/zod/schemas/userAuthSchema";
import styles from "./login.module.scss";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(selectAuth);

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

  // Логирование состояния формы
  useEffect(() => {}, [formData, isFormValid, errors, touched]);

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

  // Очистка ошибок при размонтировании
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    setTouched((prev) => ({ ...prev, [id]: true }));
    dispatch(clearError());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      console.warn("[Login] Form is not valid");
      return;
    }

    try {
      await dispatch(login(formData)).unwrap();

      // Редирект на страницу, с которой пришли, или на главную
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        "/";
      navigate(from, { replace: true });
    } catch (error) {
      // Ошибка уже сохранена в state через extraReducers
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.logo}>
        <Logo />
        <div className={styles.backButtonContainer}>
          <Button to="/" variant="tertiary" leftIcon={<ArrowLeftIcon />}>
            Назад
          </Button>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.loginContainer}>
          <h2 className={styles.title}>Вход в аккаунт</h2>

          <Button variant="signup" leftIcon={<GoogleIcon />}>
            Продолжить с Google
          </Button>
          <Button variant="signup" leftIcon={<AppleIcon />}>
            Продолжить с Apple
          </Button>

          <Separator />

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.emailContainer}>
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                id="email"
                placeholder="Введите email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div className={styles.passwordContainer}>
              <label htmlFor="password">Пароль</label>
              <Input
                type="password"
                id="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
            </div>

            {error && (
              <div className={styles.errorMessage} role="alert">
                {error}
              </div>
            )}

            <Button
              htmlType="submit"
              disabled={!isFormValid || isLoading}
              onClick={() => {
                console.log("🖱️ [Login] Button clicked!", {
                  isFormValid,
                  isLoading,
                  disabled: !isFormValid || isLoading,
                });
              }}
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>

            <div className={styles.registerLink}>
              <p>
                Нет аккаунта?{" "}
                <Button to="/registration/step1" variant="tertiary">
                  Зарегистрироваться
                </Button>
              </p>
            </div>
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
            <h3 className={styles.welcomeTitle}>Добро пожаловать обратно!</h3>
            <p className={styles.description}>
              Войдите в свой аккаунт, чтобы продолжить обмен навыками с другими
              пользователями
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
