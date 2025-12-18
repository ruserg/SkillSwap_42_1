import { renderHook } from "@testing-library/react";
import { useFilteredUsers } from "./useFilteredUsers";

const makeUser = (overrides: Partial<any> = {}) => ({
  id: 1,
  gender: "M",
  cityId: 1,
  dateOfRegistration: "2024-01-01",
  likesCount: 0,
  isLikedByCurrentUser: false,
  ...overrides,
});

const makeSkill = (overrides: Partial<any> = {}) => ({
  id: 1,
  userId: 1,
  subcategoryId: 10,
  type_of_proposal: "offer",
  title: "Skill",
  name: "Skill",
  description: "",
  images: [],
  ...overrides,
});

describe("useFilteredUsers", () => {
  it("если фильтров нет — hasActiveFilters=false, filteredOffers=[], sortedUsers=[]", () => {
    const { result } = renderHook(() =>
      useFilteredUsers({
        filters: { purpose: "", skills: [], gender: "", cityAll: [] },
        usersWithLikes: [makeUser()],
        skills: [makeSkill()],
        sortByDate: false,
      } as any),
    );

    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.filteredOffers).toEqual([]);
    expect(result.current.sortedUsers).toEqual([]);
  });

  it("gender='Не имеет значения' не фильтрует по полу", () => {
    const users = [
      makeUser({ id: 1, gender: "M" }),
      makeUser({ id: 2, gender: "F" }),
    ];
    const skills = [
      makeSkill({ id: 1, userId: 1 }),
      makeSkill({ id: 2, userId: 2 }),
    ];

    const { result } = renderHook(() =>
      useFilteredUsers({
        filters: {
          purpose: "Всё",
          skills: [],
          gender: "Не имеет значения",
          cityAll: [],
        },
        usersWithLikes: users,
        skills,
        sortByDate: false,
      } as any),
    );

    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.filteredOffers).toHaveLength(2);
  });

  it("gender='Женщины' фильтрует пользователей", () => {
    const users = [
      makeUser({ id: 1, gender: "M" }),
      makeUser({ id: 2, gender: "F" }),
    ];
    const skills = [makeSkill({ id: 2, userId: 2 })];

    const { result } = renderHook(() =>
      useFilteredUsers({
        filters: { purpose: "Всё", skills: [], gender: "Женщины", cityAll: [] },
        usersWithLikes: users,
        skills,
        sortByDate: false,
      } as any),
    );

    expect(result.current.filteredOffers).toHaveLength(1);
    expect(result.current.filteredOffers[0].user.id).toBe(2);
  });

  it("gender='Мужчины' фильтрует пользователей", () => {
    const users = [
      makeUser({ id: 1, gender: "M" }),
      makeUser({ id: 2, gender: "F" }),
    ];
    const skills = [makeSkill({ id: 1, userId: 1 })];

    const { result } = renderHook(() =>
      useFilteredUsers({
        filters: { purpose: "Всё", skills: [], gender: "Мужчины", cityAll: [] },
        usersWithLikes: users,
        skills,
        sortByDate: false,
      } as any),
    );

    expect(result.current.filteredOffers).toHaveLength(1);
    expect(result.current.filteredOffers[0].user.id).toBe(1);
  });

  it("cityAll фильтрует пользователей по cityId", () => {
    const users = [
      makeUser({ id: 1, cityId: 1 }),
      makeUser({ id: 2, cityId: 2 }),
    ];
    const skills = [makeSkill({ id: 2, userId: 2 })];

    const { result } = renderHook(() =>
      useFilteredUsers({
        filters: { purpose: "Всё", skills: [], gender: "", cityAll: [2] },
        usersWithLikes: users,
        skills,
        sortByDate: false,
      } as any),
    );

    expect(result.current.filteredOffers).toHaveLength(1);
    expect(result.current.filteredOffers[0].user.cityId).toBe(2);
  });

  it("purpose='Хочу научиться' оставляет только offer", () => {
    const users = [makeUser({ id: 1 })];
    const skills = [
      makeSkill({ id: 1, userId: 1, type_of_proposal: "offer" }),
      makeSkill({ id: 2, userId: 1, type_of_proposal: "request" }),
    ];

    const { result } = renderHook(() =>
      useFilteredUsers({
        filters: {
          purpose: "Хочу научиться",
          skills: [],
          gender: "",
          cityAll: [],
        },
        usersWithLikes: users,
        skills,
        sortByDate: false,
      } as any),
    );

    expect(result.current.filteredOffers).toHaveLength(1);
    expect(result.current.filteredOffers[0].skill.type_of_proposal).toBe(
      "offer",
    );
  });

  it("purpose='Хочу научить' оставляет только request", () => {
    const users = [makeUser({ id: 1 })];
    const skills = [
      makeSkill({ id: 1, userId: 1, type_of_proposal: "offer" }),
      makeSkill({ id: 2, userId: 1, type_of_proposal: "request" }),
    ];

    const { result } = renderHook(() =>
      useFilteredUsers({
        filters: {
          purpose: "Хочу научить",
          skills: [],
          gender: "",
          cityAll: [],
        },
        usersWithLikes: users,
        skills,
        sortByDate: false,
      } as any),
    );

    expect(result.current.filteredOffers).toHaveLength(1);
    expect(result.current.filteredOffers[0].skill.type_of_proposal).toBe(
      "request",
    );
  });

  it("filters.skills фильтрует по subcategoryId", () => {
    const users = [makeUser({ id: 1 })];
    const skills = [
      makeSkill({ id: 1, userId: 1, subcategoryId: 10 }),
      makeSkill({ id: 2, userId: 1, subcategoryId: 11 }),
    ];

    const { result } = renderHook(() =>
      useFilteredUsers({
        filters: { purpose: "Всё", skills: [11], gender: "", cityAll: [] },
        usersWithLikes: users,
        skills,
        sortByDate: false,
      } as any),
    );

    expect(result.current.filteredOffers).toHaveLength(1);
    expect(result.current.filteredOffers[0].skill.subcategoryId).toBe(11);
  });

  it("sortedUsers: уникализирует пользователей даже если несколько skills подходят", () => {
    const users = [makeUser({ id: 1 })];
    const skills = [
      makeSkill({ id: 1, userId: 1, subcategoryId: 10 }),
      makeSkill({ id: 2, userId: 1, subcategoryId: 10 }),
    ];

    const { result } = renderHook(() =>
      useFilteredUsers({
        filters: { purpose: "Всё", skills: [10], gender: "", cityAll: [] },
        usersWithLikes: users,
        skills,
        sortByDate: false,
      } as any),
    );

    expect(result.current.filteredOffers).toHaveLength(2);
    expect(result.current.sortedUsers).toHaveLength(1);
    expect(result.current.sortedUsers[0].id).toBe(1);
  });

  it("sortByDate=true сортирует sortedUsers по dateOfRegistration desc", () => {
    const users = [
      makeUser({ id: 1, dateOfRegistration: "2024-01-01" }),
      makeUser({ id: 2, dateOfRegistration: "2024-03-01" }),
      makeUser({ id: 3, dateOfRegistration: "2024-02-01" }),
    ];

    const skills = [
      makeSkill({ id: 1, userId: 1, subcategoryId: 10 }),
      makeSkill({ id: 2, userId: 2, subcategoryId: 10 }),
      makeSkill({ id: 3, userId: 3, subcategoryId: 10 }),
    ];

    const { result } = renderHook(() =>
      useFilteredUsers({
        filters: { purpose: "Всё", skills: [10], gender: "", cityAll: [] },
        usersWithLikes: users,
        skills,
        sortByDate: true,
      } as any),
    );

    expect(result.current.sortedUsers.map((u: any) => u.id)).toEqual([2, 3, 1]);
  });
});
