import type {
  TUser,
  TCity,
  TSkill,
  TCategory,
  TSubcategory,
} from "@/shared/types/types";

//объект, чтобы было удобно использовать в других файлах
export const MOCK_API = {
  categories: "https://api.jsonbin.io/v3/b/692dcfe6ae596e708f7cb637",
  cities: "https://api.jsonbin.io/v3/b/692dd00343b1c97be9d0f6af",
  skills: "https://api.jsonbin.io/v3/b/692dd04343b1c97be9d0f721",
  subcategories: "https://api.jsonbin.io/v3/b/692dd05bae596e708f7cb6fc",
  users: "https://api.jsonbin.io/v3/b/692dd074ae596e708f7cb721",
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
    // Retry при 429 с экспоненциальной задержкой
    if (res.status === 429 && retryCount < 3) {
      const delayMs = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      await delay(delayMs);
      return fetchMock<T>(url, retryCount + 1);
    }
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }

  //превращаем ответ сервера в json файлы
  const data = await res.json();

  //JSONBin ВСЕГДА кладёт реальный объект внутрь поля record - поэтому возвращаем именно data.record
  return data.record;
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
// import { api } from "@/shared/api/mockApi";

// api.getUsers().then(users => {
//   console.log(users);
// });
