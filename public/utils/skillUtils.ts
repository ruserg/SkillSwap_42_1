import type { TSkill, TypeOfProposal } from "../../src/shared/types/types";

//  Фильтрует навыки пользователя по типу предложения
//  Принимает на вход skills - массив всех навыков, userId - ID пользователя,
//  type - тип навыка ("учу" или "учусь")
//  Возвращает массив навыков пользователя указанного типа
//

export const getUserSkillsByType = (
  skills: TSkill[],
  userId: number,
  type: TypeOfProposal,
): TSkill[] => {
  return skills.filter(
    (skill) => skill.userId === userId && skill.type_of_proposal === type,
  );
};
