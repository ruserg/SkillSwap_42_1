import type { TCity } from "../../src/shared/types/types";

//  Получает название города по его ID
//  Принимает на вход cityId - ID города и cities - массив городов
//  Возвращает название города или "Город не указан"
//
export const getCityNameById = (cityId: number, cities: TCity[]): string => {
  const city = cities.find((c) => c.id === cityId);
  return city ? city.name : "Город не указан";
};
