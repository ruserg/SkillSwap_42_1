import React, { useState, useEffect, useRef, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./signupStepThree.module.scss";
import { SignupSteps } from "@shared/ui/SignupSteps/SignupSteps";
import { Button } from "@shared/ui/Button/Button";
import { Logo } from "@shared/ui/Logo/Logo";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import {
  updateStep3,
  addImage,
  removeImage,
  saveSignupState,
  clearSignupData,
  submitSignup,
  selectIsSubmitting,
  selectSubmitError,
} from "@features/signup/model/slice";
import { ModalUI } from "@shared/ui/Modal/Modal";
import { api } from "@shared/api/mockApi";
import galleryAddIcon from "@images/icons/gallery-add.svg";
import chevronDown from "@images/icons/chevron-down.svg";
import schoolBoard from "@images/webp/school-board.webp";
import type { Category, Subcategory } from "./types";

// Импортируем кастомный компонент
import { OfferPreviewFormData } from "../signupStepThreePreviewForm/OfferPreviewFormData";
import { WelcomeSection } from "@shared/ui/WelcomeSection/WelcomeSection.tsx";

export const SignupStepThree = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { step3 } = useAppSelector((state) => state.signup);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const submitError = useAppSelector(selectSubmitError);

  const [skillName, setSkillName] = useState(step3.skillName);
  const [category, setCategory] = useState(step3.category);
  const [subcategory, setSubcategory] = useState(step3.subcategory);
  const [description, setDescription] = useState(step3.description);
  const [images, setImages] = useState<string[]>(step3.images);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  // Функция для перехода на главную страницу с очисткой данных
  const handleGoToHome = useCallback(() => {
    // 1. Очищаем состояние Redux
    dispatch(clearSignupData());

    // 2. Закрываем модальное окно
    setIsSuccessModalOpen(false);

    // 3. Переходим на главную страницу
    navigate("/");
  }, [dispatch, navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const [categoriesData, subcategoriesData] = await Promise.all([
          api.getCategories() as Promise<Category[]>,
          api.getSubcategories() as Promise<Subcategory[]>,
        ]);

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.categoryId.toString() === category,
  );

  const getCategoryName = (id: string) => {
    const cat = categories.find((c) => c.id.toString() === id);
    return cat ? cat.name : "Не выбрана";
  };

  const getSubcategoryName = (id: string) => {
    const sub = subcategories.find((s) => s.id.toString() === id);
    return sub ? sub.name : "Не выбрана";
  };

  useEffect(() => {
    dispatch(
      updateStep3({
        skillName,
        category,
        subcategory,
        description,
        images,
      }),
    );
  }, [skillName, category, subcategory, description, images, dispatch]);

  useEffect(() => {
    if (category !== step3.category) {
      setSubcategory("");
      setIsSubcategoryOpen(false);
    }
  }, [category, step3.category]);

  useEffect(() => {
    return () => {
      dispatch(saveSignupState());
    };
  }, [dispatch]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      dispatch(saveSignupState());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dispatch]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        alert("Файл слишком большой. Максимальный размер - 2 МБ");
        return;
      }

      if (!file.type.match("image.*")) {
        alert("Пожалуйста, выберите только изображения");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImages((prev) => [...prev, result]);
        dispatch(addImage(result));
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];

        if (file.size > 2 * 1024 * 1024) {
          alert("Файл слишком большой. Максимальный размер - 2 МБ");
          return;
        }

        if (!file.type.match("image.*")) {
          alert("Пожалуйста, перетащите только изображения");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImages((prev) => [...prev, result]);
          dispatch(addImage(result));
        };
        reader.readAsDataURL(file);
      }
    },
    [dispatch],
  );

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    dispatch(removeImage(index));
  };

  const handleContinue = () => {
    if (!skillName.trim()) {
      alert("Пожалуйста, введите название навыка");
      return;
    }

    if (!category) {
      alert("Пожалуйста, выберите категорию");
      return;
    }

    if (!subcategory) {
      alert("Пожалуйста, выберите подкатегорию");
      return;
    }

    if (!description.trim()) {
      alert("Пожалуйста, добавьте описание навыка");
      return;
    }

    dispatch(saveSignupState());
    setIsOfferModalOpen(true);
  };

  const handleConfirmOffer = async () => {
    setIsOfferModalOpen(false);

    try {
      // Отправляем регистрацию через signup thunk
      await dispatch(submitSignup()).unwrap();

      // После успешной регистрации показываем модальное окно успеха
      setIsSuccessModalOpen(true);
    } catch (error) {
      // Ошибка уже сохранена в state через extraReducers
      console.error("Ошибка регистрации:", error);
      // Можно показать ошибку пользователю
      if (submitError) {
        alert(submitError);
      }
    }
  };

  // Функция для закрытия успешного модального окна
  const handleCloseSuccessModal = useCallback(() => {
    dispatch(clearSignupData());
    setIsSuccessModalOpen(false);
    navigate("/");
  }, [dispatch, navigate]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <div className={styles.steps}>
          <SignupSteps currentStep={3} />
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            {/* Для валидации: Название навыка */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="skillName">
                Название навыка
              </label>
              {isLoading ? (
                <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
              ) : (
                <input
                  id="skillName"
                  name="skillName" // Для валидации
                  className={styles.skillNameInput}
                  type="text"
                  placeholder="Введите название вашего навыка"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  required
                />
              )}
            </div>

            {/* Для валидации: Категория навыка */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="category-selector">
                Категория навыка
              </label>
              {isLoading ? (
                <div
                  className={`${styles.skeleton} ${styles.skeletonSelect}`}
                />
              ) : (
                <div id="category-selector" className={styles.selectorWrapper}>
                  <div
                    className={styles.selectorHeader}
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  >
                    <span className={styles.selectorTitle}>
                      {category
                        ? getCategoryName(category)
                        : "Выберите категорию навыка"}
                    </span>
                    <img
                      src={chevronDown}
                      alt="chevron"
                      className={`${styles.selectorChevron} ${isCategoryOpen ? styles.open : ""}`}
                    />
                  </div>
                  <input
                    type="hidden"
                    name="category"
                    value={category}
                    required
                  />
                  {isCategoryOpen && (
                    <div className={styles.optionsList}>
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          className={`${styles.optionItem} ${category === cat.id.toString() ? styles.selected : ""}`}
                          onClick={() => {
                            setCategory(cat.id.toString());
                            setIsCategoryOpen(false);
                          }}
                          data-value={cat.id}
                        >
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Для валидации: Подкатегория */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="subcategory-selector">
                Подкатегория
              </label>
              {isLoading ? (
                <div
                  className={`${styles.skeleton} ${styles.skeletonSelect}`}
                />
              ) : (
                <div
                  id="subcategory-selector"
                  className={styles.selectorWrapper}
                >
                  <div
                    className={styles.selectorHeader}
                    onClick={() =>
                      category && setIsSubcategoryOpen(!isSubcategoryOpen)
                    }
                    style={{
                      cursor: category ? "pointer" : "not-allowed",
                      opacity: category ? 1 : 0.5,
                    }}
                  >
                    <span className={styles.selectorTitle}>
                      {subcategory
                        ? getSubcategoryName(subcategory)
                        : category
                          ? "Выберите подкатегорию"
                          : "Сначала выберите категорию"}
                    </span>
                    {category && (
                      <img
                        src={chevronDown}
                        alt="chevron"
                        className={`${styles.selectorChevron} ${isSubcategoryOpen ? styles.open : ""}`}
                      />
                    )}
                  </div>
                  <input
                    type="hidden"
                    name="subcategory"
                    value={subcategory}
                    required={!!category}
                  />
                  {isSubcategoryOpen && category && (
                    <div className={styles.optionsList}>
                      {filteredSubcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className={`${styles.optionItem} ${subcategory === sub.id.toString() ? styles.selected : ""}`}
                          onClick={() => {
                            setSubcategory(sub.id.toString());
                            setIsSubcategoryOpen(false);
                          }}
                          data-value={sub.id}
                        >
                          {sub.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Для валидации: Описание */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="description">
                Описание
              </label>
              {isLoading ? (
                <div
                  className={`${styles.skeleton} ${styles.skeletonTextarea}`}
                />
              ) : (
                <textarea
                  id="description"
                  name="description"
                  className={styles.descriptionTextarea}
                  placeholder="Коротко опишите, чему можете научить"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  maxLength={500}
                  minLength={10}
                />
              )}
            </div>

            {/* Для валидации: Изображения */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="images-upload">
                Изображения
              </label>

              {isLoading ? (
                <div
                  className={`${styles.skeleton} ${styles.skeletonUploadArea}`}
                />
              ) : (
                <>
                  <div
                    ref={dragAreaRef}
                    id="images-upload"
                    className={`${styles.uploadArea} ${isDragging ? styles.dragging : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className={styles.uploadText}>
                      Перетащите или выберите изображения навыка
                    </div>
                    <button
                      type="button"
                      className={styles.uploadButton}
                      onClick={handleFileSelect}
                    >
                      <img
                        src={galleryAddIcon}
                        alt="Добавить"
                        className={styles.uploadButtonIcon}
                      />
                      Выбрать изображения
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file-input"
                      name="images"
                      accept="image/*"
                      multiple
                      className={styles.fileInput}
                      onChange={handleFileChange}
                      // Для валидации файлов:
                      // data-max-size="5242880" (5MB)
                      // data-accepted-types="image/jpeg,image/png,image/gif"
                    />
                  </div>

                  {images.length > 0 && (
                    <div className={styles.imagePreviews}>
                      {images.map((img, index) => (
                        <div key={index} className={styles.imagePreview}>
                          <img
                            src={img}
                            alt={`Предпросмотр ${index + 1}`}
                            className={styles.previewImage}
                          />
                          <button
                            type="button"
                            className={styles.removeImage}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={styles.buttons}>
              <Button to="/registration/step2" variant="secondary">
                Назад
              </Button>
              <Button
                onClick={handleContinue}
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? "Загрузка..." : "Продолжить"}
              </Button>
            </div>
          </form>
        </div>
        <WelcomeSection
          src={schoolBoard}
          alt={"Иллюстрация"}
          title={"Укажите, чем вы готовы поделиться"}
          description={
            "Так другие люди смогут увидеть ваши предложения и предложить вам обмен"
          }
        />
      </section>

      {/* Модальное окно подтверждения с данными из формы */}
      {isOfferModalOpen && (
        <ModalUI onClose={() => setIsOfferModalOpen(false)}>
          <div className={styles.modalPreviewContainer}>
            <div className={styles.modalPreviewHeader}>
              <h3 className={styles.modalPreviewTitle}>Ваше предложение</h3>
              <p className={styles.modalPreviewSubtitle}>
                Пожалуйста, проверьте и подтвердите правильность данных
              </p>
            </div>

            <OfferPreviewFormData
              skillName={skillName}
              categoryName={getCategoryName(category)}
              subcategoryName={getSubcategoryName(subcategory)}
              description={description}
              images={images}
              onEdit={() => {
                setIsOfferModalOpen(false);
              }}
              onConfirm={handleConfirmOffer}
            />
          </div>
        </ModalUI>
      )}

      {/* Финальное модальное окно успешного завершения */}
      {isSuccessModalOpen && (
        <ModalUI onClose={handleCloseSuccessModal}>
          <div className={styles.successModalContainer}>
            <div className={styles.successModalTitle}>
              Предложение успешно создано!
            </div>
            <p className={styles.successModalDescription}>
              Теперь вы можете предлагать обмен навыками с другими
              пользователями.
            </p>
            <div className={styles.successModalButton}>
              <Button onClick={handleGoToHome}>Перейти на главную</Button>
            </div>
          </div>
        </ModalUI>
      )}
    </>
  );
};
