import { api } from "@shared/api/api";
import type { TCity } from "../types";
import { citiesReducer, clearError, fetchCities, selectCities } from "./slice";

type CitiesState = ReturnType<typeof citiesReducer>;

const makeCity = (overrides: Partial<TCity> = {}): TCity => ({
  id: 1,
  name: "Moscow",
  ...overrides,
});

describe("cities slice", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("initialState при неизвестном экшене", () => {
    const state = citiesReducer(undefined, { type: "unknown" });
    expect(state).toEqual({
      cities: [],
      isLoading: false,
      error: null,
    });
  });

  it("clearError сбрасывает error", () => {
    const prev: CitiesState = {
      cities: [],
      isLoading: false,
      error: "boom",
    };

    const next = citiesReducer(prev, clearError());
    expect(next.error).toBeNull();
  });

  it("fetchCities.pending ставит isLoading=true и error=null", () => {
    const prev: CitiesState = {
      cities: [makeCity()],
      isLoading: false,
      error: "old",
    };

    const next = citiesReducer(prev, fetchCities.pending("r1", undefined));
    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
  });

  it("fetchCities.fulfilled кладёт cities и снимает isLoading", () => {
    const prev: CitiesState = {
      cities: [],
      isLoading: true,
      error: "old",
    };

    const payload = {
      cities: [
        makeCity({ id: 1, name: "Moscow" }),
        makeCity({ id: 2, name: "SPB" }),
      ],
    };

    const next = citiesReducer(
      prev,
      fetchCities.fulfilled(payload as any, "r1", undefined),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.cities).toHaveLength(2);
    expect(next.cities[1].name).toBe("SPB");
  });

  it("fetchCities.rejected кладёт error из payload и снимает isLoading", () => {
    const prev: CitiesState = {
      cities: [],
      isLoading: true,
      error: null,
    };

    const next = citiesReducer(
      prev,
      fetchCities.rejected(new Error("x"), "r1", undefined, "fail"),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe("fail");
  });

  it("selector selectCities возвращает cities + isLoading", () => {
    const state = {
      cities: {
        cities: [makeCity({ id: 3, name: "Kazan" })],
        isLoading: true,
        error: null,
      },
    };

    const data = selectCities(state as any);
    expect(data.isLoading).toBe(true);
    expect(data.cities).toHaveLength(1);
    expect(data.cities[0].name).toBe("Kazan");
  });

  // --- thunk tests ---

  it("fetchCities thunk: Error -> rejected(payload=error.message)", async () => {
    jest.spyOn(api, "getCities").mockRejectedValueOnce(new Error("boom"));

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchCities()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchCities.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("boom");
  });

  it("fetchCities thunk: non-Error -> rejected(payload=default)", async () => {
    jest.spyOn(api, "getCities").mockRejectedValueOnce(null);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchCities()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchCities.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка загрузки городов");
  });
});
