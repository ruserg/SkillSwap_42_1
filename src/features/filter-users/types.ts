export interface TFilterState {
  purpose: string;
  skills: number[];
  gender: string;
  cityAll: number[];
}

export const FILTER_CONFIG = {
  SKILLS_VISIBLE_COUNT: 5,
  CITIES_VISIBLE_COUNT: 5,
} as const;
