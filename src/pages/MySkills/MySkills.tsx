import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shared/ui/Button/Button";
import { OfferPreview } from "@widgets/OfferPreview/OfferPreview";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { selectUser as selectAuthUser } from "@features/auth/model/slice";
import { fetchSkillsData } from "@entities/skill/model/slice";
import { fetchCategories } from "@entities/category/model/slice";
import styles from "./mySkills.module.scss";

export const MySkills = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authUser = useAppSelector(selectAuthUser);
  const { skills, isLoading: skillsLoading } = useAppSelector(
    (state) => state.skillsData,
  );
  const {
    categories,
    subcategories,
    isLoading: categoriesLoading,
  } = useAppSelector((state) => state.categoryData);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchSkillsData()),
          dispatch(fetchCategories()),
        ]);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    loadData();
  }, [dispatch]);

  const userTeachSkills = useMemo(() => {
    if (!authUser || !skills.length) return [];
    return skills.filter(
      (skill) =>
        skill.userId === authUser.id && skill.type_of_proposal === "offer",
    );
  }, [authUser, skills]);

  const enrichedSkills = useMemo(() => {
    return userTeachSkills
      .map((skill) => {
        const subcategory = subcategories.find(
          (sub) => sub.id === skill.subcategoryId,
        );

        let categoryName = "";
        if (subcategory) {
          const category = categories.find(
            (cat) => cat.id === subcategory.categoryId,
          );
          categoryName = category?.name || "";
        }

        return {
          id: skill.id,
          skillName: skill.title,
          categoryName,
          subcategoryName: subcategory?.name || "",
          description: skill.description,
          images: skill.images || [],
          createdAt: skill.modified_datetime || "",
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [userTeachSkills, categories, subcategories]);

  // Функция для редактирования навыка
  const handleEditSkill = (skillId: string) => {
    navigate(`/profile/skills/edit/${skillId}`);
  };

  // TODO: переделать страницу чтоб это был не 3 шаг регистрации
  const handleAddSkill = () => {
    navigate("/registration/step3", {
      state: { returnTo: "/profile" },
    });
  };

  const isLoading = skillsLoading || categoriesLoading;

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои навыки</h1>
        <Button
          variant="primary"
          style={{ inlineSize: "50%" }}
          onClick={handleAddSkill}
          aria-label="Добавить новый навык"
        >
          + Добавить навык
        </Button>
      </div>

      <div className={styles.content}>
        {!isLoading && enrichedSkills.length === 0 ? (
          <div className={styles.emptyState}>
            <p>У вас пока нет навыков, которыми вы можете поделиться</p>
            <Button variant="primary" onClick={handleAddSkill}>
              Создать первый навык
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.skillsList}>
              {isLoading
                ? [1, 2].map((i) => (
                    <div key={i} className={styles.skillSkeleton}>
                      <div className={styles.skeletonHeader}></div>
                      <div className={styles.skeletonDescription}></div>
                      <div className={styles.skeletonImage}></div>
                    </div>
                  ))
                : enrichedSkills.map((skill) => (
                    <div key={skill.id} className={styles.skillCard}>
                      <OfferPreview
                        variant="mySkills"
                        skillName={skill.skillName}
                        categoryName={skill.categoryName}
                        subcategoryName={skill.subcategoryName}
                        description={skill.description}
                        images={skill.images}
                        onEdit={() => handleEditSkill(skill.id.toString())}
                      />
                    </div>
                  ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
