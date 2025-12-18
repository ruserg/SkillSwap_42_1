import { useMemo } from "react";
import type { TFilterState } from "../types";
import type { TSkill } from "@entities/skill/types";
import type { UserWithLikes } from "@entities/user/types";

interface UseFilteredUsersParams {
  filters: TFilterState;
  usersWithLikes: UserWithLikes[];
  skills: TSkill[];
  sortByDate: boolean;
}

interface FilteredResult {
  filteredOffers: Array<{ skill: TSkill; user: UserWithLikes }>;
  sortedUsers: UserWithLikes[];
  hasActiveFilters: boolean;
}

export const useFilteredUsers = ({
  filters,
  usersWithLikes,
  skills,
  sortByDate,
}: UseFilteredUsersParams): FilteredResult => {
  const hasActiveFilters =
    filters.purpose !== "" ||
    filters.skills.length > 0 ||
    filters.gender !== "" ||
    filters.cityAll.length > 0;

  const filteredOffers = useMemo(() => {
    if (!hasActiveFilters) {
      return [];
    }

    let filteredUsers = usersWithLikes;

    if (filters.gender !== "" && filters.gender !== "Не имеет значения") {
      const genderMap: Record<string, string> = {
        Мужчины: "M",
        Женщины: "F",
      };
      const targetGender = genderMap[filters.gender];
      if (targetGender) {
        filteredUsers = filteredUsers.filter(
          (user) => user.gender === targetGender,
        );
      }
    }

    if (filters.cityAll.length > 0) {
      const cityIdsSet = new Set(filters.cityAll);
      filteredUsers = filteredUsers.filter((user) =>
        cityIdsSet.has(user.cityId),
      );
    }

    const filteredSkills: Array<{ skill: TSkill; user: UserWithLikes }> = [];

    filteredUsers.forEach((user) => {
      const userSkills = skills.filter((skill) => skill.userId === user.id);

      userSkills.forEach((skill) => {
        if (filters.purpose !== "" && filters.purpose !== "Всё") {
          const purposeMap: Record<string, "offer" | "request"> = {
            "Хочу научиться": "offer",
            "Хочу научить": "request",
          };
          const targetType = purposeMap[filters.purpose];
          if (targetType && skill.type_of_proposal !== targetType) {
            return;
          }
        }

        if (filters.skills.length > 0) {
          if (!filters.skills.includes(skill.subcategoryId)) {
            return;
          }
        }

        filteredSkills.push({ skill, user });
      });
    });

    return filteredSkills;
  }, [hasActiveFilters, usersWithLikes, skills, filters]);

  // Получаем уникальных пользователей с отфильтрованными навыками и сортируем по дате регистрации (от новых к старым)
  const filteredUsers = useMemo(() => {
    const userMap = new Map<number, UserWithLikes>();
    filteredOffers.forEach(({ user }) => {
      if (!userMap.has(user.id)) {
        userMap.set(user.id, user);
      }
    });
    return Array.from(userMap.values());
  }, [filteredOffers]);

  const sortedUsers = useMemo(() => {
    if (!sortByDate) return filteredUsers;

    return [...filteredUsers].sort(
      (a, b) =>
        new Date(b.dateOfRegistration).getTime() -
        new Date(a.dateOfRegistration).getTime(),
    );
  }, [filteredUsers, sortByDate]);

  return {
    filteredOffers,
    sortedUsers,
    hasActiveFilters,
  };
};
