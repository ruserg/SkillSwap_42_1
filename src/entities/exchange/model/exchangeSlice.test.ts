import { api } from "@shared/api/api";
import type { Exchange, ExchangeStatus } from "../types";
import {
  clearExchange,
  createExchange,
  exchangeReducer,
  getExchange,
  getExchangeStatus,
  selectCurrentExchange,
  selectExchangeError,
  selectExchangeLoading,
} from "./slice";

type ExchangeState = ReturnType<typeof exchangeReducer>;

const makeExchange = (overrides: Partial<Exchange> = {}): Exchange => ({
  id: 1,
  fromUserId: 10,
  toUserId: 20,
  fromSkillId: 100,
  toSkillId: 200,
  status: "pending" as ExchangeStatus,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  ...overrides,
});

describe("exchange slice", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("initialState при неизвестном экшене", () => {
    const state = exchangeReducer(undefined, { type: "unknown" });
    expect(state).toEqual({
      currentExchange: null,
      isLoading: false,
      error: null,
    });
  });

  it("clearExchange очищает currentExchange и error", () => {
    const prev: ExchangeState = {
      currentExchange: makeExchange(),
      isLoading: false,
      error: "boom",
    };

    const next = exchangeReducer(prev, clearExchange());
    expect(next.currentExchange).toBeNull();
    expect(next.error).toBeNull();
  });

  it("createExchange.pending ставит isLoading=true и сбрасывает error", () => {
    const prev: ExchangeState = {
      currentExchange: null,
      isLoading: false,
      error: "old",
    };

    const next = exchangeReducer(
      prev,
      createExchange.pending("r1", {
        fromUserId: 10,
        toUserId: 20,
        fromSkillId: 100,
        toSkillId: 200,
      } as any),
    );

    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
  });

  it("createExchange.fulfilled кладёт currentExchange и снимает isLoading", () => {
    const prev: ExchangeState = {
      currentExchange: null,
      isLoading: true,
      error: null,
    };

    const payload = makeExchange({ id: 7 });

    const next = exchangeReducer(
      prev,
      createExchange.fulfilled(payload as any, "r1", {} as any),
    );

    expect(next.isLoading).toBe(false);
    expect(next.currentExchange?.id).toBe(7);
  });

  it("createExchange.rejected кладёт error (из payload) и снимает isLoading", () => {
    const prev: ExchangeState = {
      currentExchange: null,
      isLoading: true,
      error: null,
    };

    const next = exchangeReducer(
      prev,
      createExchange.rejected(new Error("x"), "r1", {} as any, "fail"),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe("fail");
  });

  it("createExchange.rejected кладёт дефолтный error если payload пустой", () => {
    const prev: ExchangeState = {
      currentExchange: null,
      isLoading: true,
      error: null,
    };

    const next = exchangeReducer(
      prev,
      createExchange.rejected(new Error("x"), "r1", {} as any),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe("Ошибка при создании запроса на обмен");
  });

  it("getExchangeStatus.fulfilled обновляет status/updatedAt если currentExchange есть", () => {
    const prev: ExchangeState = {
      currentExchange: makeExchange({
        status: "pending",
        updatedAt: "2024-01-01",
      }),
      isLoading: false,
      error: null,
    };

    const payload = {
      status: "accepted",
      message: "ok",
      updatedAt: "2024-02-01",
    };

    const next = exchangeReducer(
      prev,
      getExchangeStatus.fulfilled(payload as any, "r1", 1),
    );

    expect(next.currentExchange?.status).toBe("accepted");
    expect(next.currentExchange?.updatedAt).toBe("2024-02-01");
  });

  it("getExchangeStatus.fulfilled ничего не делает если currentExchange=null", () => {
    const prev: ExchangeState = {
      currentExchange: null,
      isLoading: false,
      error: null,
    };

    const payload = {
      status: "accepted",
      message: "ok",
      updatedAt: "2024-02-01",
    };

    const next = exchangeReducer(
      prev,
      getExchangeStatus.fulfilled(payload as any, "r1", 1),
    );

    expect(next.currentExchange).toBeNull();
  });

  it("getExchange.fulfilled кладёт currentExchange", () => {
    const prev: ExchangeState = {
      currentExchange: null,
      isLoading: false,
      error: null,
    };

    const payload = makeExchange({ id: 99 });

    const next = exchangeReducer(
      prev,
      getExchange.fulfilled(payload as any, "r1", 99),
    );

    expect(next.currentExchange?.id).toBe(99);
  });

  it("selectors: selectCurrentExchange/selectExchangeLoading/selectExchangeError", () => {
    const state = {
      exchange: {
        currentExchange: makeExchange({ id: 5 }),
        isLoading: true,
        error: "e",
      },
    };

    expect(selectCurrentExchange(state as any)?.id).toBe(5);
    expect(selectExchangeLoading(state as any)).toBe(true);
    expect(selectExchangeError(state as any)).toBe("e");
  });

  it("createExchange thunk: success -> fulfilled", async () => {
    jest
      .spyOn(api as any, "createExchange")
      .mockResolvedValueOnce(makeExchange({ id: 7 }));

    const dispatched: any[] = [];
    const dispatch = (action: any) => {
      dispatched.push(action);
      return action;
    };
    const getState = () => ({}) as any;

    await createExchange({
      fromUserId: 10,
      toUserId: 20,
      fromSkillId: 100,
      toSkillId: 200,
    } as any)(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === createExchange.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.id).toBe(7);
  });

  it("createExchange thunk: error -> rejected with message", async () => {
    jest
      .spyOn(api as any, "createExchange")
      .mockRejectedValueOnce(new Error("boom"));

    const dispatched: any[] = [];
    const dispatch = (action: any) => {
      dispatched.push(action);
      return action;
    };
    const getState = () => ({}) as any;

    await createExchange({
      fromUserId: 10,
      toUserId: 20,
      fromSkillId: 100,
      toSkillId: 200,
    } as any)(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === createExchange.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("boom");
  });

  it("getExchangeStatus thunk: success -> fulfilled", async () => {
    jest.spyOn(api as any, "getExchangeStatus").mockResolvedValueOnce({
      status: "accepted",
      message: "ok",
      updatedAt: "2024-02-01",
    });

    const dispatched: any[] = [];
    const dispatch = (action: any) => {
      dispatched.push(action);
      return action;
    };
    const getState = () => ({}) as any;

    await getExchangeStatus(123)(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === getExchangeStatus.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.status).toBe("accepted");
  });

  it("getExchangeStatus thunk: error -> rejected with default if no message", async () => {
    jest.spyOn(api as any, "getExchangeStatus").mockRejectedValueOnce({});

    const dispatched: any[] = [];
    const dispatch = (action: any) => {
      dispatched.push(action);
      return action;
    };
    const getState = () => ({}) as any;

    await getExchangeStatus(123)(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === getExchangeStatus.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка при получении статуса обмена");
  });

  it("getExchange thunk: success -> fulfilled", async () => {
    jest
      .spyOn(api as any, "getExchange")
      .mockResolvedValueOnce(makeExchange({ id: 99 }));

    const dispatched: any[] = [];
    const dispatch = (action: any) => {
      dispatched.push(action);
      return action;
    };
    const getState = () => ({}) as any;

    await getExchange(99)(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === getExchange.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.id).toBe(99);
  });

  it("getExchange thunk: error -> rejected with default if no message", async () => {
    jest.spyOn(api as any, "getExchange").mockRejectedValueOnce(null);

    const dispatched: any[] = [];
    const dispatch = (action: any) => {
      dispatched.push(action);
      return action;
    };
    const getState = () => ({}) as any;

    await getExchange(99)(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === getExchange.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка при получении информации об обмене");
  });
});
