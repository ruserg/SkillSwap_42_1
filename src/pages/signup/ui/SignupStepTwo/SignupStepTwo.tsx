import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import styles from "./signupStepTwo.module.scss";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import { Logo } from "@shared/ui/Logo/Logo";
import userInfo from "@images/png/user-info.png";
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
} from "@features/signup/model/slice";
import { setAvatarFile } from "@features/signup/model/slice";
import {
  fetchCategories,
  selectCategoryData,
} from "@entities/category/model/slice";
import { fetchCities, selectCities } from "@entities/city/model/slice";
import { CategorySelector } from "@pages/signup/ui/SignupStepThree/CategorySelector";
import { SkeletonField } from "@pages/signup/ui/SignupStepThree/SkeletonField";
import { WelcomeSection } from "@shared/ui/WelcomeSection/WelcomeSection";
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";

export const SignupStepTwo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const firstName = useAppSelector(selectFirstName);
  const location = useAppSelector(selectLocation);
  const gender = useAppSelector(selectGender);
  const dateOfBirth = useAppSelector(selectDateOfBirth);
  const avatar = useAppSelector(selectAvatar);
  const learnCategories = useAppSelector(selectLearnCategories);
  const learnSubcategories = useAppSelector(selectLearnSubcategories);
  const isRegistering = useAppSelector(selectIsRegistering);
  const registerError = useAppSelector(selectRegisterError);

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
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (dateOfBirth) {
      setSelectedDate(new Date(dateOfBirth));
    } else {
      setSelectedDate(null);
    }
  }, [dateOfBirth]);

  useEffect(() => {
    if (categoriesData.length === 0 && !isCategoriesLoading) {
      dispatch(fetchCategories());
    }
    if (citiesData.length === 0 && !isCitiesLoading) {
      dispatch(fetchCities());
    }
  }, [
    dispatch,
    categoriesData.length,
    isCategoriesLoading,
    citiesData.length,
    isCitiesLoading,
  ]);

  useEffect(() => {
    const handleClickOutsideCity = (event: MouseEvent) => {
      // Если открыт селектор города
      if (openSelectorId === "city") {
        // Проверяем, был ли клик вне самого селектора
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
    if (id === "date" && showCalendar) {
      setShowCalendar(false);
      return;
    }
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

      if (
        showCalendar &&
        selectorsRef.current &&
        !selectorsRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    const handleScroll = () => {
      if (openSelectorId) {
        setOpenSelectorId(null);
      }
      if (showCalendar) {
        setShowCalendar(false);
      }
    };

    const handleResize = () => {
      if (openSelectorId) {
        setOpenSelectorId(null);
      }
      if (showCalendar) {
        setShowCalendar(false);
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
  }, [openSelectorId, showCalendar]);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(updateFirstName(value));
  };

  const handleDateOfBirthChange = (value: Date | null) => {
    setSelectedDate(value);

    if (value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      dispatch(updateDateOfBirth(formattedDate));
    } else {
      dispatch(updateDateOfBirth(""));
    }

    setShowCalendar(false);
  };

  const handleGenderChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] || "" : value;
    const genderValue = selectedValue === "Не указан" ? "" : selectedValue;
    dispatch(updateGender(genderValue));
  };

  const handleCityChange = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] || "" : value;

    if (
      selectedValue === "Введите или выберите город" ||
      selectedValue === ""
    ) {
      dispatch(updateStep2({ location: "" }));
      return;
    }

    const selectedCity = citiesData.find((city) => city.name === selectedValue);
    const cityId = selectedCity ? selectedCity.id.toString() : "";

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
    dispatch(clearAvatar());
  };

  const handleCategoryChange = (selectedIds: string[]) => {
    // Убеждаемся, что сохраняются именно ID, а не названия
    const validIds = selectedIds.filter((id) => {
      const isValid = categoriesData.some((cat) => cat.id.toString() === id);
      if (!isValid) {
        console.warn(`[SignupStepTwo] Invalid category ID: ${id}, skipping`);
      }
      return isValid;
    });
    dispatch(setLearnCategories(validIds));
  };

  const handleSubcategoryChange = (selectedIds: string[]) => {
    // Убеждаемся, что сохраняются именно ID подкатегорий, а не названия
    const filteredSubs = getFilteredSubcategories();
    const validIds = selectedIds.filter((id) => {
      const isValid = filteredSubs.some((sub) => sub.id.toString() === id);
      if (!isValid) {
        console.warn(`[SignupStepTwo] Invalid subcategory ID: ${id}, skipping`);
      }
      return isValid;
    });
    dispatch(setLearnSubcategories(validIds));
  };

  const getFilteredSubcategories = () => {
    if (learnCategories.length === 0) return [];
    return subcategoriesData.filter((sub) =>
      learnCategories.includes(sub.categoryId.toString()),
    );
  };

  const handleContinue = async () => {
    if (!firstName.trim()) {
      alert("Пожалуйста, введите имя");
      return;
    }

    if (learnCategories.length === 0) {
      alert(
        "Пожалуйста, выберите хотя бы одну категорию навыка, которому хотите научиться",
      );
      return;
    }

    if (learnSubcategories.length === 0) {
      alert(
        "Пожалуйста, выберите хотя бы одну подкатегорию навыка, которому хотите научиться",
      );
      return;
    }

    // Регистрируем пользователя перед переходом на шаг 3
    try {
      await dispatch(registerUserAfterStep2()).unwrap();
      // Если регистрация успешна, переходим на шаг 3
      navigate("/registration/step3");
    } catch (error) {
      // Ошибка уже обработана в slice, можно показать дополнительное сообщение
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
      <div className={clsx(styles.logo)}>
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

          <form ref={selectorsRef} className={clsx(styles.form)}>
            {/* Имя */}
            <div className={clsx(styles.nameContainer, styles.container)}>
              <label htmlFor="firstName">Имя</label>
              {isLoading ? (
                <SkeletonField type="input" count={1} />
              ) : (
                <Input
                  type="text"
                  id="firstName"
                  placeholder="Введите ваше имя"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  required
                />
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
                    selectedIds={learnCategories}
                    onChange={handleCategoryChange}
                    placeholder="Выберите категорию"
                    disabled={false}
                    isLoading={isLoading}
                  />
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
                    selectedIds={learnSubcategories}
                    onChange={handleSubcategoryChange}
                    placeholder="Выберите подкатегорию"
                    disabled={learnCategories.length === 0}
                    isLoading={isLoading}
                  />
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
              >
                Назад
              </Button>
              <Button onClick={handleContinue} disabled={isLoading}>
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
