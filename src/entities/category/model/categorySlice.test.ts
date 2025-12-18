import { api } from "@shared/api/api";
import type { TCategory, TSubcategory } from "../types";
import {
  categoryDataReducer,
  clearError,
  fetchCategories,
  selectCategoryData,
} from "./slice";

type CategoryState = ReturnType<typeof categoryDataReducer>;

const makeCategory = (overrides: Partial<TCategory> = {}): TCategory => ({
  id: 1,
  name: "Cat",
  ...overrides,
});

const makeSubcategory = (
  overrides: Partial<TSubcategory> = {},
): TSubcategory => ({
  id: 10,
  categoryId: 1,
  name: "Sub",
  ...overrides,
});

describe("categoryData slice", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("initialState при неизвестном экшене", () => {
    const state = categoryDataReducer(undefined, { type: "unknown" });
    expect(state).toEqual({
      categories: [],
      subcategories: [],
      isLoading: false,
      error: null,
    });
  });

  it("clearError сбрасывает error", () => {
    const prev: CategoryState = {
      categories: [],
      subcategories: [],
      isLoading: false,
      error: "boom",
    };

    const next = categoryDataReducer(prev, clearError());
    expect(next.error).toBeNull();
  });

  it("fetchCategories.pending ставит isLoading=true и error=null", () => {
    const prev: CategoryState = {
      categories: [makeCategory()],
      subcategories: [makeSubcategory()],
      isLoading: false,
      error: "old",
    };

    const next = categoryDataReducer(
      prev,
      fetchCategories.pending("r1", undefined),
    );

    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
  });

  it("fetchCategories.fulfilled кладёт categories+subcategories и снимает isLoading", () => {
    const prev: CategoryState = {
      categories: [],
      subcategories: [],
      isLoading: true,
      error: "old",
    };

    const payload = {
      categories: [
        makeCategory({ id: 1, name: "A" }),
        makeCategory({ id: 2, name: "B" }),
      ],
      subcategories: [
        makeSubcategory({ id: 10, categoryId: 1, name: "S1" }),
        makeSubcategory({ id: 11, categoryId: 2, name: "S2" }),
      ],
    };

    const next = categoryDataReducer(
      prev,
      fetchCategories.fulfilled(payload as any, "r1", undefined),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.categories).toHaveLength(2);
    expect(next.subcategories).toHaveLength(2);
    expect(next.categories[1].name).toBe("B");
    expect(next.subcategories[0].categoryId).toBe(1);
  });

  it("fetchCategories.rejected кладёт error из payload и снимает isLoading", () => {
    const prev: CategoryState = {
      categories: [],
      subcategories: [],
      isLoading: true,
      error: null,
    };

    const next = categoryDataReducer(
      prev,
      fetchCategories.rejected(new Error("x"), "r1", undefined, "fail"),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe("fail");
  });

  it("selector selectCategoryData возвращает categories+subcategories+isLoading", () => {
    const state = {
      categoryData: {
        categories: [makeCategory({ id: 3, name: "C" })],
        subcategories: [makeSubcategory({ id: 99, categoryId: 3, name: "S" })],
        isLoading: true,
        error: null,
      },
    };

    const data = selectCategoryData(state as any);
    expect(data.isLoading).toBe(true);
    expect(data.categories[0].name).toBe("C");
    expect(data.subcategories).toHaveLength(1);
    expect(data.subcategories[0].categoryId).toBe(3);
  });

  it("fetchCategories thunk: вызывает api.getCategories и api.getSubcategories и возвращает оба массива", async () => {
    jest
      .spyOn(api, "getCategories")
      .mockResolvedValueOnce([makeCategory({ id: 1, name: "A" })] as any);

    jest
      .spyOn(api, "getSubcategories")
      .mockResolvedValueOnce([
        makeSubcategory({ id: 10, categoryId: 1, name: "S1" }),
      ] as any);

    const dispatched: any[] = [];
    const dispatch = (action: any) => {
      dispatched.push(action);
      return action;
    };
    const getState = () => ({}) as any;

    await fetchCategories()(dispatch as any, getState, undefined);

    expect(api.getCategories).toHaveBeenCalledTimes(1);
    expect(api.getSubcategories).toHaveBeenCalledTimes(1);

    const fulfilled = dispatched.find(
      (a) => a?.type === fetchCategories.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.categories[0].name).toBe("A");
    expect(fulfilled.payload.subcategories[0].name).toBe("S1");
  });

  it("fetchCategories thunk: при Error возвращает rejected с сообщением error.message", async () => {
    jest.spyOn(api, "getCategories").mockRejectedValueOnce(new Error("boom"));
    jest
      .spyOn(api, "getSubcategories")
      .mockResolvedValueOnce([makeSubcategory()] as any);

    const dispatched: any[] = [];
    const dispatch = (action: any) => {
      dispatched.push(action);
      return action;
    };
    const getState = () => ({}) as any;

    await fetchCategories()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchCategories.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("boom");
  });

  it("fetchCategories thunk: при не-Error возвращает rejected с дефолтным текстом", async () => {
    jest.spyOn(api, "getCategories").mockRejectedValueOnce("nope");
    jest
      .spyOn(api, "getSubcategories")
      .mockResolvedValueOnce([makeSubcategory()] as any);

    const dispatched: any[] = [];
    const dispatch = (action: any) => {
      dispatched.push(action);
      return action;
    };
    const getState = () => ({}) as any;

    await fetchCategories()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchCategories.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка загрузки категорий");
  });
});
