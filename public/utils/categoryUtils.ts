import type { TSubcategory } from "@/shared/types/types";
//  Утилиты для работы с категориями и подкатегориями
//  Получает ID категории по ID подкатегории
//  На вход принимает subcategoryId - ID подкатегории (от 1 до 42)
//  и массив subcategories
//  Возвращает ID категории (1-6) или 0, если не найдено
//

export const getCategoryIdBySubcategory = (
  subcategoryId: number,
  subcategories: TSubcategory[],
): number => {
  const subcategory = subcategories.find((s) => s.id === subcategoryId);
  return subcategory ? subcategory.categoryId : 0;
};

//
//  Получает название класса CSS для тега на основе ID категории
//  На вход принимает categoryId - ID категории и styles - объект стилей из модуля
//  Возвращает название класса CSS
//

export const getTagClassName = (
  categoryId: number,
  styles: Record<string, string>,
): string => {
  const colorMap: Record<number, string> = {
    1: styles.business,
    2: styles.creativity,
    3: styles.languages,
    4: styles.education,
    5: styles.home,
    6: styles.health,
  };
  return colorMap[categoryId] || styles.default;
};
