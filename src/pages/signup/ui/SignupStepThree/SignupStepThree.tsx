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
  clearSignupData,
  setCategories,
  setSubcategories,
  selectTeachCategories,
  selectTeachSubcategories,
  createSkills,
} from "@features/signup/model/slice";
import { ModalUI } from "@shared/ui/Modal/Modal";
import galleryAddIcon from "@images/icons/gallery-add.svg";
import schoolBoard from "@images/webp/school-board.webp";

import {
  fetchCategories,
  selectCategoryData,
} from "@entities/category/model/slice";
import {
  signupStep3Schema,
  type SignupStep3Data,
} from "@/shared/lib/zod/schemas/skillSchema";
import { OfferPreview } from "@widgets/OfferPreview/OfferPreview";
import { CategorySelector } from "./CategorySelector";
import { WelcomeSection } from "@shared/ui/WelcomeSection/WelcomeSection";
import type z from "zod";

interface ImageFile {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
}

export const SignupStepThree = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const teachCategories = useAppSelector(selectTeachCategories);
  const teachSubcategories = useAppSelector(selectTeachSubcategories);

  const { step3 } = useAppSelector((state) => state.signup);
  const skillName = step3?.skillName || "";
  const description = step3?.description || "";
  const images = step3?.images || [];

  const {
    categories: categoriesData,
    subcategories: subcategoriesData,
    isLoading,
  } = useAppSelector(selectCategoryData);

  const [formData, setFormData] = useState<SignupStep3Data>({
    title: "",
    description: "",
    category: [],
    subcategory: [],
    images: [],
  });

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    category: false,
    subcategory: false,
    images: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupStep3Data, string>>
  >({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [localSkillName, setLocalSkillName] = useState(skillName);
  const [localDescription, setLocalDescription] = useState(description);
  const [localImages, setLocalImages] = useState<ImageFile[]>(() => {
    if (!images || !Array.isArray(images)) {
      return [];
    }
    return images.map((img, index) => ({
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

  // Инициализация формы данными из Redux
  useEffect(() => {
    setFormData({
      title: skillName || "",
      description: description || "",
      category: teachCategories || [],
      subcategory: teachSubcategories || [],
      images: images || [],
    });
  }, [skillName, description, teachCategories, teachSubcategories, images]);

  // Валидация формы при изменении данных
  useEffect(() => {
    const result = signupStep3Schema.safeParse(formData);

    if (result.success) {
      setErrors({});
      setIsFormValid(true);
    } else {
      const newErrors: Partial<Record<keyof SignupStep3Data, string>> = {};

      result.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as keyof SignupStep3Data;
        if (field && touched[field]) {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);
      setIsFormValid(false);
    }
  }, [formData, touched]);

  // Синхронизация состояния формы с Redux
  useEffect(() => {
    setLocalSkillName(formData.title);
    setLocalDescription(formData.description);
  }, [formData.title, formData.description]);

  // Синхронизация изображений
  useEffect(() => {
    const currentImageUrls = localImages.map((img) => img.dataUrl);
    setFormData((prev) => ({ ...prev, images: currentImageUrls }));
  }, [localImages]);

  const handleGoToHome = useCallback(() => {
    dispatch(clearSignupData());
    setIsSuccessModalOpen(false);
    navigate("/");
  }, [dispatch, navigate]);

  useEffect(() => {
    if (categoriesData.length === 0 && !isLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesData.length, isLoading]);

  const getSelectedCategoryNames = () => {
    if (
      !teachCategories ||
      !Array.isArray(teachCategories) ||
      !categoriesData ||
      !Array.isArray(categoriesData)
    ) {
      return "";
    }
    return teachCategories
      .map((id) => {
        const cat = categoriesData.find((c) => c.id.toString() === id);
        return cat ? cat.name : "";
      })
      .filter((name) => name)
      .join(", ");
  };

  const getSelectedSubcategoryNames = () => {
    if (
      !teachSubcategories ||
      !Array.isArray(teachSubcategories) ||
      !subcategoriesData ||
      !Array.isArray(subcategoriesData)
    ) {
      return "";
    }
    return teachSubcategories
      .map((id) => {
        const sub = subcategoriesData.find((s) => s.id.toString() === id);
        return sub ? sub.name : "";
      })
      .filter((name) => name)
      .join(", ");
  };

  const getFilteredSubcategories = () => {
    if (
      !teachCategories ||
      !Array.isArray(teachCategories) ||
      teachCategories.length === 0
    ) {
      return [];
    }
    if (!subcategoriesData || !Array.isArray(subcategoriesData)) {
      return [];
    }
    return subcategoriesData.filter((sub) =>
      teachCategories.includes(sub.categoryId.toString()),
    );
  };

  useEffect(() => {
    const currentImageUrls = localImages.map((img) => img.dataUrl);
    dispatch(
      updateStep3({
        skillName: localSkillName,
        description: localDescription,
        images: currentImageUrls,
      }),
    );
  }, [localSkillName, localDescription, localImages, dispatch]);

  useEffect(() => {
    if (teachCategories.length === 0 && teachSubcategories.length > 0) {
      dispatch(setSubcategories([]));
    }
  }, [teachCategories, dispatch]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, title: value }));
    setTouched((prev) => ({ ...prev, title: true }));
    setLocalSkillName(value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, description: value }));
    setTouched((prev) => ({ ...prev, description: true }));
    setLocalDescription(value);
  };

  const handleCategoryChange = (selectedIds: string[]) => {
    setFormData((prev) => ({ ...prev, category: selectedIds }));
    setTouched((prev) => ({ ...prev, category: true }));
    dispatch(setCategories(selectedIds));
  };

  const handleSubcategoryChange = (selectedIds: string[]) => {
    setFormData((prev) => ({ ...prev, subcategory: selectedIds }));
    setTouched((prev) => ({ ...prev, subcategory: true }));
    dispatch(setSubcategories(selectedIds));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const newImage: ImageFile = {
          id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          dataUrl: result,
        };
        setLocalImages((prev) => [...prev, newImage]);
        setTouched((prev) => ({ ...prev, images: true }));
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
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const newImage: ImageFile = {
              id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              size: file.size,
              dataUrl: result,
            };
            setLocalImages((prev) => [...prev, newImage]);
            setTouched((prev) => ({ ...prev, images: true }));
            dispatch(addImage(result));
          };
          reader.readAsDataURL(file);
        });
      }
    },
    [dispatch],
  );

  const handleRemoveImage = (id: string) => {
    const imageIndex = localImages.findIndex((img) => img.id === id);
    if (imageIndex !== -1) {
      setLocalImages((prev) => prev.filter((img) => img.id !== id));
      setTouched((prev) => ({ ...prev, images: true }));
      dispatch(removeImage(imageIndex));
    }
  };

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Помечаем все поля как "затронутые" для показа всех ошибок
    const allTouched = {
      title: true,
      description: true,
      category: true,
      subcategory: true,
      images: true,
    };
    setTouched(allTouched);

    // Проверяем валидность всей формы
    const validationResult = signupStep3Schema.safeParse(formData);

    if (!validationResult.success) {
      // Собираем все ошибки
      const validationErrors: Partial<Record<keyof SignupStep3Data, string>> =
        {};

      validationResult.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as keyof SignupStep3Data;
        if (field) {
          validationErrors[field] = issue.message;
        }
      });

      setErrors(validationErrors);

      return;
    }
    setIsOfferModalOpen(true);
  };

  const handleConfirmOffer = async () => {
    try {
      // Сохраняем данные в Redux перед отправкой
      dispatch(
        updateStep3({
          skillName: formData.title,
          description: formData.description,
          images: formData.images,
        }),
      );

      // Отправляем данные на сервер через API
      await dispatch(createSkills()).unwrap();

      // Если успешно, показываем модальное окно успеха
      setIsOfferModalOpen(false);
      setIsSuccessModalOpen(true);

      setLocalSkillName("");
      setLocalDescription("");
      setLocalImages([]);
      dispatch(setCategories([]));
      dispatch(setSubcategories([]));
    } catch (error) {
      console.error("Ошибка при создании навыка:", error);
      alert("Не удалось создать предложение. Попробуйте еще раз.");
    }
  };

  const handleCloseSuccessModal = useCallback(() => {
    dispatch(clearSignupData());
    setIsSuccessModalOpen(false);
    navigate("/");
  }, [dispatch, navigate]);

  return (
    <div className={styles.pageWrapper}>
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
          <form className={styles.form} onSubmit={handleContinue}>
            {/* Название навыка */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="skillName">
                Название навыка
              </label>
              {isLoading ? (
                <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
              ) : (
                <>
                  <input
                    id="skillName"
                    name="skillName"
                    className={styles.skillNameInput}
                    type="text"
                    placeholder="Введите название вашего навыка"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                  />
                  {errors.title && touched.title && (
                    <span className={styles.errorText}>{errors.title}</span>
                  )}
                </>
              )}
            </div>

            {/* Категория навыка */}
            {isLoading ? (
              <div className={styles.fieldGroup}>
                <div
                  className={`${styles.skeleton} ${styles.skeletonSelect}`}
                />
              </div>
            ) : (
              <>
                <CategorySelector
                  label="Категория навыка"
                  options={categoriesData.map((cat) => ({
                    id: cat.id.toString(),
                    name: cat.name,
                  }))}
                  selectedIds={formData.category}
                  onChange={handleCategoryChange}
                  placeholder="Выберите категории навыка"
                />
                {errors.category && touched.category && (
                  <span className={styles.errorText}>{errors.category}</span>
                )}
              </>
            )}

            {/* Подкатегория */}
            {isLoading ? (
              <div className={styles.fieldGroup}>
                <div
                  className={`${styles.skeleton} ${styles.skeletonSelect}`}
                />
              </div>
            ) : (
              <>
                <CategorySelector
                  label="Подкатегория"
                  options={getFilteredSubcategories().map((sub) => ({
                    id: sub.id.toString(),
                    name: sub.name,
                  }))}
                  selectedIds={formData.subcategory}
                  onChange={handleSubcategoryChange}
                  placeholder="Выберите подкатегории"
                  disabled={formData.category.length === 0}
                />
                {errors.subcategory && touched.subcategory && (
                  <span className={styles.errorText}>{errors.subcategory}</span>
                )}
              </>
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
                <>
                  <textarea
                    id="description"
                    name="description"
                    className={styles.descriptionTextarea}
                    placeholder="Коротко опишите, чему можете научить"
                    rows={4}
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    required
                    maxLength={500}
                    minLength={10}
                  />
                  {errors.description && touched.description && (
                    <span className={styles.errorText}>
                      {errors.description}
                    </span>
                  )}
                </>
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

                  {errors.images && touched.images && (
                    <span className={styles.errorText}>{errors.images}</span>
                  )}

                  {localImages.length > 0 && (
                    <div className={styles.fileItems}>
                      {localImages.map((img) => (
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
              <Button onClick={handleContinue} disabled={isLoading}>
                {isLoading ? "Загрузка..." : "Продолжить"}
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
            <OfferPreview
              variant="modalOffer"
              skillName={formData.title}
              categoryName={getSelectedCategoryNames()}
              subcategoryName={getSelectedSubcategoryNames()}
              description={formData.description}
              images={formData.images}
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
              пользователями. Перейдите в личный кабинет, чтобы увидеть ваше
              предложение.
            </p>
            <div className={styles.successModalButton}>
              <Button onClick={handleGoToHome}>Перейти на главную</Button>
            </div>
          </div>
        </ModalUI>
      )}
    </div>
  );
};
