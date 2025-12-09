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
  setCategories,
  setSubcategories,
} from "@features/signup/model/slice";
import { ModalUI } from "@shared/ui/Modal/Modal";
import galleryAddIcon from "@images/icons/gallery-add.svg";
import schoolBoard from "@images/webp/school-board.webp";

// Импортируем компоненты категорий
import {
  fetchCategories,
  selectCategoryData,
} from "@entities/category/model/slice";

// Импортируем кастомный компонент
import { OfferPreviewFormData } from "../signupStepThreePreviewForm/OfferPreviewFormData";
import { CategorySelector } from "./CategorySelector";

interface ImageFile {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
}

export const SignupStepThree = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { step3 } = useAppSelector((state) => state.signup);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const submitError = useAppSelector(selectSubmitError);

  // Получаем данные категорий из entities
  const {
    categories: categoriesData,
    subcategories: subcategoriesData,
    isLoading,
  } = useAppSelector(selectCategoryData);

  const [skillName, setSkillName] = useState(step3.skillName);
  const [description, setDescription] = useState(step3.description);
  const [images, setImages] = useState<ImageFile[]>(() => {
    return step3.images.map((img, index) => ({
      id: `image-${index}-${Date.now()}`,
      name: `image-${index}.jpg`,
      size: 1024 * 1024,
      dataUrl: img,
    }));
  });

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  // Функция для перехода на главную страницу с очисткой данных
  const handleGoToHome = useCallback(() => {
    dispatch(clearSignupData());
    setIsSuccessModalOpen(false);
    navigate("/");
  }, [dispatch, navigate]);

  // Загружаем категории при монтировании
  useEffect(() => {
    if (categoriesData.length === 0 && !isLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesData.length, isLoading]);

  // Получаем имена выбранных категорий и подкатегорий
  const getSelectedCategoryNames = () => {
    return step3.category
      .map((id) => {
        const cat = categoriesData.find((c) => c.id.toString() === id);
        return cat ? cat.name : "";
      })
      .filter((name) => name);
  };

  const getSelectedSubcategoryNames = () => {
    return step3.subcategory
      .map((id) => {
        const sub = subcategoriesData.find((s) => s.id.toString() === id);
        return sub ? sub.name : "";
      })
      .filter((name) => name);
  };

  // Фильтруем подкатегории по выбранным категориям
  const getFilteredSubcategories = () => {
    if (step3.category.length === 0) return [];
    return subcategoriesData.filter((sub) =>
      step3.category.includes(sub.categoryId.toString()),
    );
  };

  useEffect(() => {
    const currentImageUrls = images.map((img) => img.dataUrl);
    dispatch(
      updateStep3({
        skillName,
        description,
        images: currentImageUrls,
      }),
    );
  }, [skillName, description, images, dispatch]);

  // Очищаем подкатегории при изменении категорий
  useEffect(() => {
    if (step3.category.length === 0 && step3.subcategory.length > 0) {
      dispatch(setSubcategories([]));
    }
  }, [step3.category, dispatch]);

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
        const newImage: ImageFile = {
          id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          dataUrl: result,
        };
        setImages((prev) => [...prev, newImage]);
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
        Array.from(files).forEach((file) => {
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
            const newImage: ImageFile = {
              id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              size: file.size,
              dataUrl: result,
            };
            setImages((prev) => [...prev, newImage]);
            dispatch(addImage(result));
          };
          reader.readAsDataURL(file);
        });
      }
    },
    [dispatch],
  );

  const handleRemoveImage = (id: string) => {
    const imageIndex = images.findIndex((img) => img.id === id);
    if (imageIndex !== -1) {
      setImages((prev) => prev.filter((img) => img.id !== id));
      dispatch(removeImage(imageIndex));
    }
  };

  const handleContinue = () => {
    if (!skillName.trim()) {
      alert("Пожалуйста, введите название навыка");
      return;
    }

    if (step3.category.length === 0) {
      alert("Пожалуйста, выберите хотя бы одну категорию");
      return;
    }

    if (step3.subcategory.length === 0) {
      alert("Пожалуйста, выберите хотя бы одну подкатегорию");
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
      await dispatch(submitSignup()).unwrap();
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      if (submitError) {
        alert(submitError);
      }
    }
  };

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
            {/* Название навыка */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="skillName">
                Название навыка
              </label>
              {isLoading ? (
                <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
              ) : (
                <input
                  id="skillName"
                  name="skillName"
                  className={styles.skillNameInput}
                  type="text"
                  placeholder="Введите название вашего навыка"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  required
                />
              )}
            </div>

            {/* Категория навыка - используем кастомный селектор */}
            {isLoading ? (
              <div className={styles.fieldGroup}>
                <div
                  className={`${styles.skeleton} ${styles.skeletonSelect}`}
                />
              </div>
            ) : (
              <CategorySelector
                label="Категория навыка"
                options={categoriesData.map((cat) => ({
                  id: cat.id.toString(),
                  name: cat.name,
                }))}
                selectedIds={step3.category}
                onChange={(selectedIds) => dispatch(setCategories(selectedIds))}
                placeholder="Выберите категории навыка"
              />
            )}

            {/* Подкатегория - используем кастомный селектор */}
            {isLoading ? (
              <div className={styles.fieldGroup}>
                <div
                  className={`${styles.skeleton} ${styles.skeletonSelect}`}
                />
              </div>
            ) : (
              <CategorySelector
                label="Подкатегория"
                options={getFilteredSubcategories().map((sub) => ({
                  id: sub.id.toString(),
                  name: sub.name,
                }))}
                selectedIds={step3.subcategory}
                onChange={(selectedIds) =>
                  dispatch(setSubcategories(selectedIds))
                }
                placeholder="Выберите подкатегории"
                disabled={step3.category.length === 0}
              />
            )}

            {/* Описание */}
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

            {/* Изображения */}
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
                      <div className={styles.uploadHint}>
                        Максимальный размер файла: 2 МБ
                      </div>
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
                    />
                  </div>

                  {images.length > 0 && (
                    <div className={styles.fileItems}>
                      {images.map((img) => (
                        <div key={img.id} className={styles.fileItem}>
                          <span className={styles.fileName}>{img.name}</span>
                          <button
                            type="button"
                            className={styles.removeFile}
                            onClick={() => handleRemoveImage(img.id)}
                            title="Удалить файл"
                            aria-label={`Удалить файл ${img.name}`}
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

        <div className={styles.infoContainer}>
          <div className={styles.imageWrapper}>
            {schoolBoard ? (
              <img
                src={schoolBoard}
                alt="Иллюстрация"
                className={styles.infoImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <div className={styles.placeholderIcon}>💡</div>
              </div>
            )}
          </div>

          <div className={styles.infoText}>
            <h3 className={styles.infoTitle}>
              Укажите, чем вы готовы поделиться
            </h3>
            <p className={styles.infoDescription}>
              Так другие люди смогут увидеть ваши предложения и предложить вам
              обмен
            </p>
          </div>
        </div>
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
              categoryName={getSelectedCategoryNames().join(", ")}
              subcategoryName={getSelectedSubcategoryNames().join(", ")}
              description={description}
              images={images.map((img) => img.dataUrl)}
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
