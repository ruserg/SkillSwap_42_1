import type { TUser } from "@entities/user/types";
import type { TCategory, TSubcategory } from "@entities/category/types";
import type { TCity } from "@entities/city/types";
import type { TSkill } from "@entities/skill/types";

// Используем локальные моки из public/db/
// Для переключения на JSONBin API замените пути на /api/jsonbin/v3/b/...
export const MOCK_API = {
  categories: "/db/categories.json",
  cities: "/db/cities.json",
  likes: "/db/likes.json",
  skills: "/db/skills.json",
  subcategories: "/db/subcategories.json",
  users: "/db/users.json",
};

// Тип для ответа API с данными пользователей
export type UsersDataResponse = {
  users: TUser[];
  cities: TCity[];
  skills: TSkill[];
};

// Задержка между запросами для избежания rate limit
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//функция загрузки данных, <T> - данные, которые получим
export async function fetchMock<T>(url: string, retryCount = 0): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    // Retry при 429 с экспоненциальной задержкой (для JSONBin API)
    if (res.status === 429 && retryCount < 3) {
      const delayMs = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      await delay(delayMs);
      return fetchMock<T>(url, retryCount + 1);
    }
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }

  //превращаем ответ сервера в json файлы
  const data = await res.json();

  // Для JSONBin API данные находятся в data.record, для локальных файлов - напрямую data
  // Проверяем, есть ли поле record (JSONBin формат)
  if (data && typeof data === "object" && "record" in data) {
    return data.record;
  }

  // Для локальных файлов возвращаем данные напрямую
  return data;
}

export const api = {
  //вызываем fetchMock с сылкой - возвращаем массив
  getCategories: () => fetchMock<TCategory[]>(MOCK_API.categories),
  getCities: () => fetchMock<TCity[] | { cities: TCity[] }>(MOCK_API.cities),
  getSkills: () => fetchMock<TSkill[]>(MOCK_API.skills),
  getSubcategories: () => fetchMock<TSubcategory[]>(MOCK_API.subcategories),
  getUsers: () => fetchMock<TUser[]>(MOCK_API.users),

  /**
   * Загружает все данные пользователей (users, cities, skills)
   * Использует существующие методы API для единообразия
   */
  fetchAllUsersData: async (): Promise<UsersDataResponse> => {
    const [usersData, citiesData, skillsData] = await Promise.all([
      api.getUsers(),
      api.getCities(),
      api.getSkills(),
    ]);

    // cities может быть массивом или объектом с полем cities
    const citiesArray: TCity[] = Array.isArray(citiesData)
      ? citiesData
      : (citiesData as { cities: TCity[] }).cities || [];

    // Оставляем даты как строки для сериализации в Redux
    return {
      users: usersData as TUser[],
      cities: citiesArray,
      skills: skillsData as TSkill[],
    };
  },
};

//пример использования
// import { api } from "@shared/api/mockApi";

// api.getUsers().then(users => {
//   console.log(users);
// });
