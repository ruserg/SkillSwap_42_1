import React, { useState, useEffect, useRef, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./skillForm.module.scss";
import { Button } from "@shared/ui/Button/Button";
import { useAppSelector } from "@app/store/hooks";
import { ModalUI } from "@shared/ui/Modal/Modal";
import galleryAddIcon from "@images/icons/gallery-add.svg";
import { selectCategoryData } from "@entities/category/model/slice";
import { CategorySelector } from "@pages/signup/ui/SignupStepThree/CategorySelector";
import { Loader } from "@/shared/ui/Loader/Loader";
import { api } from "@shared/api/api";
import {
  signupStep3Schema,
  type SignupStep3Data,
} from "@/shared/lib/zod/schemas/skillSchema";
import type z from "zod";
import { OfferPreview } from "@widgets/OfferPreview/OfferPreview";

interface ImageFile {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
  file?: File; // Сохраняем оригинальный файл для загрузки (только для новых изображений)
}

export const SkillForm = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();

  const isEditMode = Boolean(skillId);

  const {
    categories: categoriesData,
    subcategories: subcategoriesData,
    isLoading: categoriesLoading,
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
  const [localImages, setLocalImages] = useState<ImageFile[]>([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode); // Загружаем только при редактировании
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadSkillData = async () => {
      if (!isEditMode || !skillId || categoriesLoading) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const skill = await api.getSkill(parseInt(skillId, 10));
        setFormData((prev) => ({
          ...prev,
          title: skill.name || "",
          description: skill.description || "",
          subcategory: skill.subcategoryId
            ? [skill.subcategoryId.toString()]
            : [],
          images: skill.images || [],
        }));

        if (skill.images && Array.isArray(skill.images)) {
          const imageFiles = skill.images.map((img, index) => ({
            id: `image-${index}-${Date.now()}`,
            name: `image-${index}.jpg`,
            size: 1024 * 1024,
            dataUrl: img,
            // Не сохраняем file для существующих изображений
          }));
          setLocalImages(imageFiles);
        }
      } catch (error) {
        console.error("Ошибка загрузки навыка:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSkillData();
  }, [skillId, categoriesLoading, isEditMode]);

  useEffect(() => {
    if (formData.subcategory.length > 0 && subcategoriesData.length > 0) {
      const subcategory = subcategoriesData.find(
        (sub) => sub.id.toString() === formData.subcategory[0],
      );

      if (subcategory && formData.category.length === 0) {
        setFormData((prev) => ({
          ...prev,
          category: [subcategory.categoryId.toString()],
        }));
      }
    }
  }, [formData.subcategory, subcategoriesData]);

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

  useEffect(() => {
    const currentImageUrls = localImages.map((img) => img.dataUrl);
    setFormData((prev) => ({ ...prev, images: currentImageUrls }));
  }, [localImages]);

  const filteredSubcategories = () => {
    if (!formData.category.length || !subcategoriesData.length) {
      return [];
    }

    const categoryId = parseInt(formData.category[0]);
    return subcategoriesData.filter((sub) => sub.categoryId === categoryId);
  };

  const getSelectedCategoryName = () => {
    if (!formData.category.length || !categoriesData.length) return "";

    const category = categoriesData.find(
      (cat) => cat.id.toString() === formData.category[0],
    );
    return category?.name || "";
  };

  const getSelectedSubcategoryName = () => {
    if (!formData.subcategory.length || !subcategoriesData.length) return "";

    const subcategory = subcategoriesData.find(
      (sub) => sub.id.toString() === formData.subcategory[0],
    );
    return subcategory?.name || "";
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, title: value }));
    setTouched((prev) => ({ ...prev, title: true }));
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, description: value }));
    setTouched((prev) => ({ ...prev, description: true }));
  };

  const handleCategoryChange = (selectedIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      category: selectedIds,
      subcategory: [],
    }));
    setTouched((prev) => ({ ...prev, category: true }));
  };

  const handleSubcategoryChange = (selectedIds: string[]) => {
    setFormData((prev) => ({ ...prev, subcategory: selectedIds }));
    setTouched((prev) => ({ ...prev, subcategory: true }));
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
          file: file, // Сохраняем файл для загрузки
        };
        setLocalImages((prev) => [...prev, newImage]);
        setTouched((prev) => ({ ...prev, images: true }));
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

  const handleDrop = useCallback((e: React.DragEvent) => {
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
            file: file, // Сохраняем файл для загрузки
          };
          setLocalImages((prev) => [...prev, newImage]);
          setTouched((prev) => ({ ...prev, images: true }));
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const handleRemoveImage = (id: string) => {
    const imageIndex = localImages.findIndex((img) => img.id === id);
    if (imageIndex !== -1) {
      setLocalImages((prev) => prev.filter((img) => img.id !== id));
      setTouched((prev) => ({ ...prev, images: true }));
    }
  };

  // Обработчик сохранения
  const handleSaveChanges = (e?: React.FormEvent) => {
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

    const validationResult = signupStep3Schema.safeParse(formData);

    if (!validationResult.success) {
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

    setIsPreviewModalOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      setIsSubmitting(true);

      const subcategoryId = parseInt(formData.subcategory[0], 10);

      if (isEditMode && skillId) {
        await api.updateSkill(parseInt(skillId, 10), {
          name: formData.title,
          description: formData.description,
          subcategoryId,
          type_of_proposal: "offer" as const,
          images: formData.images,
        });

        const newImageFiles = localImages
          .filter((img) => img.file) // Только новые изображения с файлами
          .map((img) => img.file!)
          .filter((file): file is File => file !== undefined);

        if (newImageFiles.length > 0) {
          await api.uploadSkillImages(parseInt(skillId, 10), newImageFiles);
        }
      } else {
        const newSkill = await api.createSkill({
          name: formData.title,
          description: formData.description,
          subcategoryId,
          type_of_proposal: "offer" as const,
          images: [], // Изображения загрузим отдельно
        });

        // Загружаем изображения, если они есть
        const imageFiles = localImages
          .map((img) => img.file)
          .filter((file): file is File => file !== undefined);

        if (imageFiles.length > 0) {
          await api.uploadSkillImages(newSkill.id, imageFiles);
        }
      }

      setIsPreviewModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      console.error(
        `Ошибка при ${isEditMode ? "обновлении" : "создании"} навыка:`,
        error,
      );
      alert(
        error?.message ||
          `Не удалось ${isEditMode ? "обновить" : "создать"} навык. Попробуйте еще раз.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate("/skills");
  };

  const handleCancel = () => {
    navigate("/skills");
  };

  const showSkeletons = categoriesLoading || isLoading;

  return (
    <div className={styles.pageWrapper}>
      {isSubmitting && <Loader />}
      <div className={styles.formContainer}>
        <h1 className={styles.title}>
          {isEditMode ? "Редактирование навыка" : "Создание навыка"}
        </h1>
        <form className={styles.form} onSubmit={handleSaveChanges}>
          {/* Название навыка */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="skillName">
              Название навыка
            </label>
            {showSkeletons ? (
              <>
                <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
                <span className={styles.errorText}>&nbsp;</span>
              </>
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
                  disabled={isSubmitting}
                />
                {errors.title && touched.title ? (
                  <span className={styles.errorText}>{errors.title}</span>
                ) : (
                  <span className={styles.errorText}>&nbsp;</span>
                )}
              </>
            )}
          </div>

          {/* Категория навыка */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Категория навыка</label>
            {showSkeletons ? (
              <>
                <div
                  className={`${styles.skeleton} ${styles.skeletonSelect}`}
                />
                <span className={styles.errorText}>&nbsp;</span>
              </>
            ) : (
              <>
                <CategorySelector
                  label=""
                  options={categoriesData.map((cat) => ({
                    id: cat.id.toString(),
                    name: cat.name,
                  }))}
                  selectedIds={formData.category}
                  onChange={handleCategoryChange}
                  placeholder="Выберите категорию"
                  disabled={isSubmitting}
                />
                {errors.category && touched.category ? (
                  <span className={styles.errorText}>{errors.category}</span>
                ) : (
                  <span className={styles.errorText}>&nbsp;</span>
                )}
              </>
            )}
          </div>

          {/* Подкатегория */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Подкатегория</label>
            {showSkeletons ? (
              <>
                <div
                  className={`${styles.skeleton} ${styles.skeletonSelect}`}
                />
                <span className={styles.errorText}>&nbsp;</span>
              </>
            ) : (
              <>
                <CategorySelector
                  label=""
                  options={filteredSubcategories().map((sub) => ({
                    id: sub.id.toString(),
                    name: sub.name,
                  }))}
                  selectedIds={formData.subcategory}
                  onChange={handleSubcategoryChange}
                  placeholder={
                    formData.category.length > 0
                      ? "Выберите подкатегорию"
                      : "Сначала выберите категорию"
                  }
                  disabled={formData.category.length === 0 || isSubmitting}
                />
                {errors.subcategory && touched.subcategory ? (
                  <span className={styles.errorText}>{errors.subcategory}</span>
                ) : (
                  <span className={styles.errorText}>&nbsp;</span>
                )}
              </>
            )}
          </div>

          {/* Описание */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="description">
              Описание
            </label>
            {showSkeletons ? (
              <>
                <div
                  className={`${styles.skeleton} ${styles.skeletonTextarea}`}
                />
                <span className={styles.errorText}>&nbsp;</span>
              </>
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
                  disabled={isSubmitting}
                />
                {errors.description && touched.description ? (
                  <span className={styles.errorText}>{errors.description}</span>
                ) : (
                  <span className={styles.errorText}>&nbsp;</span>
                )}
              </>
            )}
          </div>

          {/* Изображения */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="images-upload">
              Изображения
            </label>

            {showSkeletons ? (
              <>
                <div
                  className={`${styles.skeleton} ${styles.skeletonUploadArea}`}
                />
                <span className={styles.errorText}>&nbsp;</span>
              </>
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                {errors.images && touched.images ? (
                  <span className={styles.errorText}>{errors.images}</span>
                ) : (
                  <span className={styles.errorText}>&nbsp;</span>
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
                          disabled={isSubmitting}
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
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting || showSkeletons}
            >
              Отмена
            </Button>

            <Button
              type="submit"
              disabled={showSkeletons || isSubmitting || !isFormValid}
            >
              {isSubmitting
                ? isEditMode
                  ? "Сохранение..."
                  : "Создание..."
                : isEditMode
                  ? "Сохранить изменения"
                  : "Создать навык"}
            </Button>
          </div>
        </form>
      </div>

      {/* Модальное окно предпросмотра (с использованием OfferPreview) */}
      {isPreviewModalOpen && (
        <ModalUI onClose={() => setIsPreviewModalOpen(false)}>
          <div className={styles.modalPreviewContainer}>
            {isSubmitting && <Loader />}
            <OfferPreview
              variant="modalOffer"
              skillName={formData.title}
              categoryName={getSelectedCategoryName()}
              subcategoryName={getSelectedSubcategoryName()}
              description={formData.description}
              images={formData.images}
              onEdit={() => {
                setIsPreviewModalOpen(false);
              }}
              onConfirm={handleConfirmSave}
            />
          </div>
        </ModalUI>
      )}

      {/* Модальное окно успеха */}
      {isSuccessModalOpen && (
        <ModalUI onClose={handleCloseSuccessModal}>
          <div className={styles.successModalContainer}>
            {isSubmitting && <Loader />}
            <div className={styles.successModalTitle}>
              {isEditMode
                ? "Предложение успешно отредактировано!"
                : "Навык успешно создан!"}
            </div>
            <p className={styles.successModalDescription}>
              {isEditMode
                ? 'Перейдите в раздел "Мои навыки", чтобы увидеть ваше предложение.'
                : 'Перейдите в раздел "Мои навыки", чтобы увидеть ваш новый навык.'}
            </p>
            <div className={styles.successButton}>
              <Button onClick={handleCloseSuccessModal}>
                Вернуться к моим навыкам
              </Button>
            </div>
          </div>
        </ModalUI>
      )}
    </div>
  );
};
