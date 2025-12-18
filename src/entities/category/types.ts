export type TCategory = {
  id: number;
  name: string;
};

export type TSubcategory = {
  id: number;
  categoryId: number;
  name: string;
};
