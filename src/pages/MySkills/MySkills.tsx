import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shared/ui/Button/Button";
import { OfferPreview } from "@widgets/OfferPreview/OfferPreview";
import { useAppSelector } from "@app/store/hooks";
import { selectUser as selectAuthUser } from "@features/auth/model/slice";
import { api } from "@shared/api/api";
import styles from "./mySkills.module.scss";

export const MySkills = () => {
  const navigate = useNavigate();

  const authUser = useAppSelector(selectAuthUser);
  const { skills, isLoading: skillsLoading } = useAppSelector(
    (state) => state.skillsData,
  );
  const {
    categories,
    subcategories,
    isLoading: categoriesLoading,
  } = useAppSelector((state) => state.categoryData);

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
          skillName: skill.name,
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

  const handleEditSkill = (skillId: string) => {
    navigate(`/profile/skills/edit/${skillId}`);
  };

  const handleDeleteSkill = async (skillId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот навык?")) {
      return;
    }

    try {
      await api.deleteSkill(skillId);
    } catch (error: any) {
      console.error("Ошибка при удалении навыка:", error);
      alert(error?.message || "Не удалось удалить навык");
    }
  };

  const handleAddSkill = () => {
    navigate("/skills/create");
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
                        onDelete={() => handleDeleteSkill(skill.id)}
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
