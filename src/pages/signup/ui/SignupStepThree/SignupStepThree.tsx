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
} from "@features/signup/model/slice";
import { ModalUI } from "@shared/ui/Modal/Modal";
import galleryAddIcon from "@images/icons/gallery-add.svg";
import schoolBoard from "@images/webp/school-board.webp";

import {
  fetchCategories,
  selectCategoryData,
} from "@entities/category/model/slice";

import { OfferPreview } from "@widgets/OfferPreview/OfferPreview";
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

  const teachCategories = useAppSelector(selectTeachCategories);
  const teachSubcategories = useAppSelector(selectTeachSubcategories);

  const { step3 } = useAppSelector((state) => state.signup);
  const skillName = step3.skillName;
  const description = step3.description;
  const images = step3.images;

  const {
    categories: categoriesData,
    subcategories: subcategoriesData,
    isLoading,
  } = useAppSelector(selectCategoryData);

  const [localSkillName, setLocalSkillName] = useState(skillName);
  const [localDescription, setLocalDescription] = useState(description);
  const [localImages, setLocalImages] = useState<ImageFile[]>(() => {
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
    return teachCategories
      .map((id) => {
        const cat = categoriesData.find((c) => c.id.toString() === id);
        return cat ? cat.name : "";
      })
      .filter((name) => name)
      .join(", ");
  };

  const getSelectedSubcategoryNames = () => {
    return teachSubcategories
      .map((id) => {
        const sub = subcategoriesData.find((s) => s.id.toString() === id);
        return sub ? sub.name : "";
      })
      .filter((name) => name)
      .join(", ");
  };

  const getFilteredSubcategories = () => {
    if (teachCategories.length === 0) return [];
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
        setLocalImages((prev) => [...prev, newImage]);
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
            setLocalImages((prev) => [...prev, newImage]);
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
      dispatch(removeImage(imageIndex));
    }
  };

  const handleContinue = () => {
    // Валидация для шага 3
    if (!localSkillName.trim()) {
      alert("Пожалуйста, введите название навыка, которому хотите научить");
      return;
    }

    if (teachCategories.length === 0) {
      alert(
        "Пожалуйста, выберите хотя бы одну категорию навыка, которому хотите научить",
      );
      return;
    }

    if (teachSubcategories.length === 0) {
      alert(
        "Пожалуйста, выберите хотя бы одну подкатегорию навыка, которому хотите научить",
      );
      return;
    }

    if (!localDescription.trim()) {
      alert("Пожалуйста, добавьте описание навыка");
      return;
    }

    setIsOfferModalOpen(true);
  };

  const saveUserOffer = useCallback(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("signupData") || "{}");

      const offerData = {
        id: `offer-${Date.now()}`,
        skillName: localSkillName,
        categoryName: getSelectedCategoryNames(),
        subcategoryName: getSelectedSubcategoryNames(),
        description: localDescription,
        images: localImages.map((img) => img.dataUrl),
        createdAt: new Date().toISOString(),

        userInfo: {
          firstName: userData.step2?.firstName || "",
          city: userData.step2?.city || "",
          gender: userData.step2?.gender || "",
          dateOfBirth: userData.step2?.dateOfBirth || "",
          avatar: userData.step2?.avatar || "",
        },
      };

      const userOffers = JSON.parse(localStorage.getItem("userOffers") || "[]");

      const updatedOffers = [...userOffers, offerData];

      localStorage.setItem("userOffers", JSON.stringify(updatedOffers));

      if (!localStorage.getItem("userProfile")) {
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            ...userData.step2,
            email: userData.step1?.email || "",
            offers: updatedOffers,
          }),
        );
      }

      return offerData;
    } catch (error) {
      console.error("Ошибка при сохранении предложения:", error);
      return null;
    }
  }, [
    localSkillName,
    localDescription,
    localImages,
    categoriesData,
    subcategoriesData,
  ]);

  const handleConfirmOffer = () => {
    const savedOffer = saveUserOffer();

    if (savedOffer) {
      setIsOfferModalOpen(false);
      setIsSuccessModalOpen(true);

      setLocalSkillName("");
      setLocalDescription("");
      setLocalImages([]);
      dispatch(setCategories([]));
      dispatch(setSubcategories([]));
    } else {
      alert("Не удалось сохранить предложение. Попробуйте еще раз.");
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
                  value={localSkillName}
                  onChange={(e) => setLocalSkillName(e.target.value)}
                  required
                />
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
              <CategorySelector
                label="Категория навыка"
                options={categoriesData.map((cat) => ({
                  id: cat.id.toString(),
                  name: cat.name,
                }))}
                selectedIds={teachCategories}
                onChange={(selectedIds) => dispatch(setCategories(selectedIds))}
                placeholder="Выберите категории навыка"
              />
            )}

            {/* Подкатегория */}
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
                selectedIds={teachSubcategories}
                onChange={(selectedIds) =>
                  dispatch(setSubcategories(selectedIds))
                }
                placeholder="Выберите подкатегории"
                disabled={teachCategories.length === 0}
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
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
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
            <OfferPreview
              variant="modalOffer"
              skillName={localSkillName}
              categoryName={getSelectedCategoryNames()}
              subcategoryName={getSelectedSubcategoryNames()}
              description={localDescription}
              images={localImages.map((img) => img.dataUrl)}
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
    </>
  );
};
