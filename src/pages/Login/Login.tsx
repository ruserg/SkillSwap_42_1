import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { login, selectAuth, clearError } from "@features/auth/model/slice";
import { Button } from "@shared/ui/Button/Button";
import { Logo } from "@shared/ui/Logo/Logo";
import { ArrowLeftIcon } from "@shared/ui/Icons/ArrowLeftIcon";
import type { SignupStep1Data } from "@shared/lib/zod/types";
import { signupStep1Schema } from "@shared/lib/zod/schemas/userAuthSchema";
import styles from "./login.module.scss";
import formStyles from "@shared/ui/Form/form.module.scss";
import { ExternalLogIn } from "@/widgets/ExternalLogIn/ExternalLogIn";
import { Loader } from "@/shared/ui/Loader/Loader";
import lightBulbLight from "@images/png/light/light-bulb.png";
import { FormField } from "@/shared/ui/FormField/FormField";
import { useFormValidation } from "@shared/hooks/useFormValidation";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(selectAuth);

  const { formData, errors, isFormValid, handleInputChange } =
    useFormValidation<SignupStep1Data>({
      schema: signupStep1Schema,
      initialValues: {
        email: "",
        password: "",
      },
    });

  const handleChangeWithClearError = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleInputChange(e);
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

      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        "/";
      navigate(from, { replace: true });
    } catch (error) {}
  };

  return (
    <div className={styles.pageWrapper}>
      {isLoading && <Loader />}
      <div className={formStyles.logo}>
        <Logo />
        <div className={formStyles.backButtonContainer}>
          <Button to="/" variant="tertiary" leftIcon={<ArrowLeftIcon />}>
            Назад
          </Button>
        </div>
      </div>

      <h1 className={styles.title}>Вход</h1>

      <section className={styles.section}>
        <div className={styles.loginContainer}>
          <ExternalLogIn />

          <form className={formStyles.form} onSubmit={handleSubmit}>
            <FormField
              label="Email"
              id="email"
              type="email"
              placeholder="Введите email"
              value={formData.email}
              onChange={handleChangeWithClearError}
              disabled={isLoading}
              error={errors.email}
            />
            <FormField
              label="Пароль"
              id="password"
              type="password"
              placeholder="Введите ваш пароль"
              value={formData.password}
              onChange={handleChangeWithClearError}
              disabled={isLoading}
              error={errors.password}
            />
            {error && (
              <div className={styles.errorMessage} role="alert">
                {error}
              </div>
            )}

            <Button
              type="submit"
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
              <Link to="/registration/step1">Зарегистрироваться</Link>
            </div>
          </form>
        </div>

        <div className={formStyles.welcomeContainer}>
          <img
            className={styles.lightBulb}
            src={lightBulbLight}
            alt="Картинка с нарисованной лампочкой"
            width="300"
            height="300"
            loading="lazy"
          />
          <div className={formStyles.descriptionContainer}>
            <h3 className={styles.welcomeTitle}>С возвращением в SkillSwap!</h3>
            <p className={styles.description}>
              Обменивайтесь знаниями и навыками с другими людьми
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
