import { useEffect, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import clsx from "clsx";
import styles from "./signupStepTwo.module.scss";
import formStyles from "@shared/ui/Form/form.module.scss";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import { Logo } from "@shared/ui/Logo/Logo";
import userInfo from "@images/png/light/user-info.png";
import userCircle from "@shared/assets/images/icons/user-circle.svg";
import add from "@images/icons/add2.svg";
import { SignupSteps } from "@shared/ui/SignupSteps/SignupSteps";
import { Selector } from "@shared/ui/Selector/Selector";
import { Calendar } from "@shared/ui/Calendar/Calendar";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import {
  updateFirstName,
  updateGender,
  updateDateOfBirth,
  updateAvatar,
  clearAvatar,
  setLearnCategories,
  setLearnSubcategories,
  selectFirstName,
  selectLocation,
  selectGender,
  selectDateOfBirth,
  selectAvatar,
  selectLearnCategories,
  selectLearnSubcategories,
  updateStep2,
  registerUserAfterStep2,
  selectIsRegistering,
  selectRegisterError,
  selectIsSubmitting,
  updateStep1,
  selectSignup,
} from "@features/signup/model/slice";
import { setAvatarFile } from "@features/signup/model/slice";
import { selectCategoryData } from "@entities/category/model/slice";
import { selectCities } from "@entities/city/model/slice";
import { CategorySelector } from "@pages/signup/ui/SignupStepThree/CategorySelector";
import { SkeletonField } from "@pages/signup/ui/SignupStepThree/SkeletonField";
import { WelcomeSection } from "@shared/ui/WelcomeSection/WelcomeSection";
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { userSchema } from "@/shared/lib/zod/schemas/userSchema";
import type { User } from "@/shared/lib/zod/types";
import { z } from "zod";
import { Loader } from "@/shared/ui/Loader/Loader";

export const SignupStepTwo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const signupState = useAppSelector(selectSignup);
  const firstName = useAppSelector(selectFirstName);
  const location = useAppSelector(selectLocation);
  const gender = useAppSelector(selectGender);
  const dateOfBirth = useAppSelector(selectDateOfBirth);
  const avatar = useAppSelector(selectAvatar);
  const learnCategories = useAppSelector(selectLearnCategories);
  const learnSubcategories = useAppSelector(selectLearnSubcategories);
  const isRegistering = useAppSelector(selectIsRegistering);
  const registerError = useAppSelector(selectRegisterError);
  const isSubmitting = useAppSelector(selectIsSubmitting);

  // Проверка, что шаг 1 пройден (есть email и password)
  // Данные восстанавливаются из localStorage при инициализации Redux store
  if (!signupState.step1.email || !signupState.step1.password) {
    return <Navigate to="/registration/step1" replace />;
  }

  const {
    categories: categoriesData,
    subcategories: subcategoriesData,
    isLoading: isCategoriesLoading,
  } = useAppSelector(selectCategoryData);

  const { cities: citiesData, isLoading: isCitiesLoading } =
    useAppSelector(selectCities);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openSelectorId, setOpenSelectorId] = useState<string | null>(null);
  const selectorsRef = useRef<HTMLFormElement | null>(null);

  // Состояние для календаря
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    dateOfBirth ? new Date(dateOfBirth) : null,
  );

  // Состояние для валидации
  const [formData, setFormData] = useState<User>({
    name: "",
    dateOfBirth: null,
    sex: "",
    city: "",
    category: [],
    subcategory: [],
    avatar: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    sex: false,
    dateOfBirth: false,
    city: false,
    category: false,
    subcategory: false,
    avatar: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setFormData({
      name: firstName || "",
      sex: gender || "",
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      city: location || "",
      category: learnCategories || [],
      subcategory: learnSubcategories || [],
      avatar: avatar || "",
    });
  }, [
    firstName,
    location,
    gender,
    dateOfBirth,
    avatar,
    learnCategories,
    learnSubcategories,
  ]);

  useEffect(() => {
    const result = userSchema.safeParse(formData);

    if (result.success) {
      setErrors({});
      setIsFormValid(true);
    } else {
      const newErrors: Partial<Record<keyof User, string>> = {};

      result.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as keyof User;
        if (field && touched[field]) {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);
      setIsFormValid(false);
    }
  }, [formData, touched]);

  useEffect(() => {
    if (dateOfBirth) {
      setSelectedDate(new Date(dateOfBirth));
    } else {
      setSelectedDate(null);
    }
  }, [dateOfBirth]);

  useEffect(() => {
    const handleClickOutsideCity = (event: MouseEvent) => {
      if (openSelectorId === "city") {
        const cityElement = document.getElementById("city-selector-container");
        if (cityElement && !cityElement.contains(event.target as Node)) {
          setOpenSelectorId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutsideCity);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCity);
    };
  }, [openSelectorId]);

  const selectedCityName =
    location && citiesData.length > 0
      ? citiesData.find((city) => city.id.toString() === location)?.name || ""
      : "";

  const handleToggle = (id: string) => {
    setOpenSelectorId((prev) => (prev === id ? null : id));
  };

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

    const handleScroll = () => {
      if (openSelectorId) {
        setOpenSelectorId(null);
      }
    };

    const handleResize = () => {
      if (openSelectorId) {
        setOpenSelectorId(null);
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSelectorId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, name: value }));
    setTouched((prev) => ({ ...prev, name: true }));
    dispatch(updateFirstName(value));
  };

  const handleDateOfBirthChange = (value: Date | null) => {
    setSelectedDate(value);

    setFormData((prev) => ({ ...prev, dateOfBirth: value }));
    setTouched((prev) => ({ ...prev, dateOfBirth: true }));

    let formattedDate = "";
    if (value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      formattedDate = `${year}-${month}-${day}`;
    }
    dispatch(updateDateOfBirth(formattedDate));
  };

  const handleGenderChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] || "" : value;
    const genderValue = selectedValue === "Не указан" ? "" : selectedValue;

    setFormData((prev) => ({ ...prev, sex: genderValue }));
    setTouched((prev) => ({ ...prev, sex: true }));
    dispatch(updateGender(genderValue));
  };

  const handleCityChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] || "" : value;

    if (
      selectedValue === "Введите или выберите город" ||
      selectedValue === ""
    ) {
      setFormData((prev) => ({ ...prev, city: "" }));
      setTouched((prev) => ({ ...prev, city: true }));
      dispatch(updateStep2({ location: "" }));
      return;
    }

    const selectedCity = citiesData.find((city) => city.name === selectedValue);
    const cityId = selectedCity ? selectedCity.id.toString() : "";

    setFormData((prev) => ({ ...prev, city: cityId }));
    setTouched((prev) => ({ ...prev, city: true }));
    dispatch(updateStep2({ location: cityId }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите файл изображения");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("Размер файла не должен превышать 2MB");
        return;
      }

      // Сохраняем File объект для отправки в API
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, avatar: base64String }));
        setTouched((prev) => ({ ...prev, avatar: true }));
        dispatch(updateAvatar(base64String));
      };
      reader.onerror = () => {
        alert("Ошибка при чтении файла");
      };
      reader.readAsDataURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, avatar: "" }));
    setTouched((prev) => ({ ...prev, avatar: true }));
    dispatch(clearAvatar());
  };

  const handleCategoryChange = (selectedIds: string[]) => {
    const validIds = selectedIds.filter((id) => {
      const isValid = categoriesData.some((cat) => cat.id.toString() === id);
      if (!isValid) {
        console.warn(`[SignupStepTwo] Invalid category ID: ${id}, skipping`);
      }
      return isValid;
    });

    setFormData((prev) => ({ ...prev, category: validIds }));
    setTouched((prev) => ({ ...prev, category: true }));
    dispatch(setLearnCategories(validIds));
  };

  const handleSubcategoryChange = (selectedIds: string[]) => {
    const filteredSubs = getFilteredSubcategories();
    const validIds = selectedIds.filter((id) => {
      const isValid = filteredSubs.some((sub) => sub.id.toString() === id);
      if (!isValid) {
        console.warn(`[SignupStepTwo] Invalid subcategory ID: ${id}, skipping`);
      }
      return isValid;
    });

    setFormData((prev) => ({ ...prev, subcategory: validIds }));
    setTouched((prev) => ({ ...prev, subcategory: true }));
    dispatch(setLearnSubcategories(validIds));
  };

  const getFilteredSubcategories = () => {
    if (learnCategories.length === 0) return [];
    return subcategoriesData.filter((sub) =>
      learnCategories.includes(sub.categoryId.toString()),
    );
  };

  const handleContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const allTouched = {
      name: true,
      sex: true,
      dateOfBirth: true,
      city: true,
      category: true,
      subcategory: true,
      avatar: true,
    };
    setTouched(allTouched);

    const validationResult = userSchema.safeParse(formData);

    if (!validationResult.success) {
      const validationErrors: Partial<Record<keyof User, string>> = {};

      validationResult.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as keyof User;
        if (field) {
          validationErrors[field] = issue.message;
        }
      });

      setErrors(validationErrors);
      return;
    }

    // Регистрируем пользователя перед переходом на шаг 3
    try {
      await dispatch(registerUserAfterStep2()).unwrap();

      try {
        localStorage.removeItem("signupStep1Data");
        localStorage.removeItem("signupStep2Data");
      } catch (error) {
        console.error("Ошибка очистки localStorage:", error);
      }

      dispatch(updateStep1({ email: "", password: "" }));
      dispatch(
        updateStep2({
          firstName: "",
          location: "",
          dateOfBirth: "",
          gender: "",
          avatar: "",
          learnCategory: [],
          learnSubcategory: [],
        }),
      );

      // Переходим на шаг 3
      navigate("/registration/step3");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
  };

  const handleBack = () => {
    navigate("/registration/step1");
  };

  const cityOptions = citiesData.map((city) => city.name);

  const isLoading = isCategoriesLoading || isCitiesLoading || isRegistering;

  return (
    <div className={clsx(styles.pageWrapper)}>
      {isSubmitting && <Loader />}
      <div className={clsx(formStyles.logo)}>
        <Logo />
      </div>
      <div className={clsx(styles.steps)}>
        <SignupSteps currentStep={2} />
      </div>
      <section className={clsx(styles.section)}>
        <div className={clsx(styles.registerContainer)}>
          {/* Аватарка */}
          <div
            className={clsx(styles.userWrapper)}
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: "pointer" }}
          >
            {isLoading ? (
              <SkeletonField
                type="image"
                count={1}
                className={styles.avatarSkeleton}
              />
            ) : avatar ? (
              <div style={{ position: "relative" }}>
                <img
                  className={styles.avatarPreview}
                  src={avatar}
                  alt="Аватар пользователя"
                  loading="lazy"
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <button
                  onClick={handleRemoveAvatar}
                  className={styles.avatarDelete}
                  title="Удалить аватар"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: "none" }}
            />
          </div>

          {errors.avatar && touched.avatar && (
            <div className={clsx(styles.container)}>
              <span className={formStyles.errorText}>{errors.avatar}</span>
            </div>
          )}

          <form
            ref={selectorsRef}
            className={clsx(styles.form)}
            onSubmit={handleContinue}
          >
            {/* Имя */}
            <div className={clsx(styles.nameContainer, styles.container)}>
              <label htmlFor="name">Имя</label>
              {isLoading ? (
                <SkeletonField type="input" count={1} />
              ) : (
                <>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Введите ваше имя"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                  />
                  {errors.name && touched.name ? (
                    <span className={styles.errorText}>{errors.name}</span>
                  ) : (
                    <span className={styles.errorText}>&nbsp;</span>
                  )}
                </>
              )}
            </div>

            <div className={clsx(styles.containerWrapper)}>
              {/* Календарь */}
              <div className={clsx(styles.container)}>
                {isLoading ? (
                  <SkeletonField type="input" count={1} />
                ) : (
                  <>
                    <label htmlFor="date">Дата рождения</label>
                    {!isLoading && (
                      <div className={clsx(styles.container)}>
                        <div className={styles.calendarContainer}>
                          <Calendar
                            value={selectedDate}
                            onChange={handleDateOfBirthChange}
                            placeholder="дд.мм.гггг"
                          />
                        </div>
                        {errors.dateOfBirth && touched.dateOfBirth ? (
                          <span className={styles.errorText}>
                            {errors.dateOfBirth}
                          </span>
                        ) : (
                          <span className={styles.errorText}>&nbsp;</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Пол */}
              <div className={clsx(styles.container)}>
                {isLoading ? (
                  <SkeletonField type="select" count={1} />
                ) : (
                  <>
                    <label>Пол</label>
                    <div className={styles.selectorWrapper}>
                      <Selector
                        id="gender"
                        isOpen={openSelectorId === "gender"}
                        onToggle={handleToggle}
                        selectionTitle={""}
                        selectionPlaceholder={"Не указан"}
                        selectionOptions={["Не указан", "Мужской", "Женский"]}
                        selectorType={"radio"}
                        onChange={handleGenderChange}
                        value={gender}
                      />
                    </div>
                    {errors.sex && touched.sex ? (
                      <span className={styles.errorText}>{errors.sex}</span>
                    ) : (
                      <span className={styles.errorText}>&nbsp;</span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Город */}
            <div
              className={clsx(styles.container)}
              id="city-selector-container"
            >
              {isLoading ? (
                <SkeletonField type="select" count={1} />
              ) : (
                <>
                  <label>Город</label>
                  <div className={styles.selectorWrapper}>
                    <Selector
                      id="city"
                      isOpen={openSelectorId === "city"}
                      onToggle={handleToggle}
                      selectionTitle={""}
                      selectionPlaceholder={"Введите или выберите город"}
                      selectionOptions={cityOptions}
                      selectorType={"radio"}
                      enableSearch={true}
                      onChange={handleCityChange}
                      value={selectedCityName}
                    />
                  </div>
                  {errors.city && touched.city ? (
                    <span className={styles.errorText}>{errors.city}</span>
                  ) : (
                    <span className={styles.errorText}>&nbsp;</span>
                  )}
                </>
              )}
            </div>

            {/* Категория навыка */}
            <div className={clsx(styles.container)}>
              {isLoading ? (
                <SkeletonField type="select" count={1} />
              ) : (
                <div className={styles.fieldGroup}>
                  <CategorySelector
                    label="Категория навыка, которому хотите научиться"
                    options={categoriesData.map((cat) => ({
                      id: cat.id.toString(),
                      name: cat.name,
                    }))}
                    selectedIds={formData.category}
                    onChange={handleCategoryChange}
                    placeholder="Выберите категорию"
                    disabled={false}
                    isLoading={isLoading}
                  />
                  {errors.category && touched.category ? (
                    <span className={styles.errorText}>{errors.category}</span>
                  ) : (
                    <span className={styles.errorText}>&nbsp;</span>
                  )}
                </div>
              )}
            </div>

            {/* Подкатегория */}
            <div className={clsx(styles.container)}>
              {isLoading ? (
                <SkeletonField type="select" count={1} />
              ) : (
                <div className={styles.fieldGroup}>
                  <CategorySelector
                    label="Подкатегория навыка, которому хотите научиться"
                    options={getFilteredSubcategories().map((sub) => ({
                      id: sub.id.toString(),
                      name: sub.name,
                    }))}
                    selectedIds={formData.subcategory}
                    onChange={handleSubcategoryChange}
                    placeholder="Выберите подкатегорию"
                    disabled={learnCategories.length === 0}
                    isLoading={isLoading}
                  />
                  {errors.subcategory && touched.subcategory ? (
                    <span className={styles.errorText}>
                      {errors.subcategory}
                    </span>
                  ) : (
                    <span className={styles.errorText}>&nbsp;</span>
                  )}
                </div>
              )}
            </div>

            {registerError && <ErrorMessage>{registerError}</ErrorMessage>}
            <div
              className={clsx(styles.containerWrapper, styles.butttonWrapper)}
            >
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={isLoading}
                type="button"
              >
                Назад
              </Button>
              <Button
                onClick={handleContinue}
                disabled={isLoading || !isFormValid}
                type="submit"
              >
                {isLoading ? "Загрузка..." : "Продолжить"}
              </Button>
            </div>
          </form>
        </div>
        <WelcomeSection
          src={userInfo}
          alt={"Картинка с говорящим человеком"}
          title={"Расскажите немного о себе"}
          description={
            "Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена"
          }
        />
      </section>
    </div>
  );
};
