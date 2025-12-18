import { api } from "@shared/api/api";
import {
  clearError,
  fetchUsersData,
  selectUsers,
  selectUsersData,
  updateUserInState,
  updateUserLikesOptimistic,
  usersDataReducer,
} from "./slice";

type UsersState = ReturnType<typeof usersDataReducer>;

const makeUser = (overrides: Partial<any> = {}): any => ({
  id: 1,
  email: "test@example.com",
  name: "User",
  gender: "M",
  cityId: 1,
  avatarUrl: "",
  about: "",
  likesCount: 0,
  isLikedByCurrentUser: false,
  dateOfBirth: "2000-01-01",
  dateOfRegistration: "2024-01-01",
  lastLoginDatetime: "2024-01-02",
  ...overrides,
});

describe("usersData slice", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("initialState при неизвестном экшене", () => {
    const state = usersDataReducer(undefined, { type: "unknown" });
    expect(state).toEqual({
      users: [],
      isLoading: false,
      error: null,
    });
  });

  it("clearError сбрасывает error", () => {
    const prev: UsersState = {
      users: [],
      isLoading: false,
      error: "boom",
    };

    const next = usersDataReducer(prev as any, clearError());
    expect(next.error).toBeNull();
  });

  it("updateUserLikesOptimistic обновляет likes у найденного пользователя", () => {
    const prev: UsersState = {
      users: [makeUser({ id: 10, likesCount: 1, isLikedByCurrentUser: false })],
      isLoading: false,
      error: null,
    };

    const next = usersDataReducer(
      prev as any,
      updateUserLikesOptimistic({
        userId: 10,
        isLiked: true,
        likesCount: 2,
      }),
    );

    expect(next.users[0].isLikedByCurrentUser).toBe(true);
    expect(next.users[0].likesCount).toBe(2);
  });

  it("fetchUsersData.pending ставит isLoading=true и error=null", () => {
    const prev: UsersState = {
      users: [],
      isLoading: false,
      error: "old",
    };

    const next = usersDataReducer(
      prev as any,
      fetchUsersData.pending("r1", undefined),
    );
    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
  });

  it("fetchUsersData.fulfilled: приводит даты к строкам (ветки string и non-string)", () => {
    const prev: UsersState = {
      users: [],
      isLoading: true,
      error: "old",
    };

    const payload = {
      users: [
        makeUser({
          id: 1,
          dateOfBirth: "2000-01-01",
          dateOfRegistration: "2024-01-01",
          lastLoginDatetime: "2024-01-02",
        }),
        makeUser({
          id: 2,
          dateOfBirth: new Date("2001-01-01"),
          dateOfRegistration: new Date("2024-02-01"),
          lastLoginDatetime: new Date("2024-02-02"),
        }),
      ],
    };

    const next = usersDataReducer(
      prev as any,
      fetchUsersData.fulfilled(payload as any, "r1", undefined),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.users).toHaveLength(2);

    expect(typeof next.users[0].dateOfBirth).toBe("string");
    expect(typeof next.users[1].dateOfBirth).toBe("string");
    expect(typeof next.users[1].dateOfRegistration).toBe("string");
    expect(typeof next.users[1].lastLoginDatetime).toBe("string");
  });

  it("fetchUsersData.rejected кладёт error из payload", () => {
    const prev: UsersState = {
      users: [],
      isLoading: true,
      error: null,
    };

    const next = usersDataReducer(
      prev as any,
      fetchUsersData.rejected(new Error("x"), "r1", undefined, "fail"),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe("fail");
  });

  it("updateUserInState.fulfilled обновляет пользователя если он найден", () => {
    const prev: UsersState = {
      users: [makeUser({ id: 1, name: "Old" })],
      isLoading: false,
      error: null,
    };

    const updated = makeUser({
      id: 1,
      name: "New",
      dateOfBirth: new Date("1999-12-31"),
      dateOfRegistration: "2020-01-01",
      lastLoginDatetime: "2020-01-02",
    });

    const next = usersDataReducer(
      prev as any,
      updateUserInState.fulfilled(updated as any, "r1", 1),
    );

    const u1 = next.users.find((u: any) => u.id === 1);
    expect(u1).toBeDefined();
    expect(u1!.name).toBe("New");
    expect(typeof u1!.dateOfBirth).toBe("string");
  });

  it("updateUserInState.fulfilled ничего не делает, если пользователя нет в state (index === -1)", () => {
    const prev: UsersState = {
      users: [makeUser({ id: 1, name: "Old" })],
      isLoading: false,
      error: null,
    };

    const updated = makeUser({ id: 999, name: "ShouldNotBeInserted" });

    const next = usersDataReducer(
      prev as any,
      updateUserInState.fulfilled(updated as any, "r1", 999),
    );

    expect(next.users).toHaveLength(1);
    expect(next.users[0].id).toBe(1);
  });

  // --- selectors ---
  it("selectors: selectUsers преобразует строки дат в Date", () => {
    const state = {
      usersData: {
        users: [makeUser({ dateOfBirth: "2000-01-01" })],
        isLoading: false,
        error: null,
      },
    };

    const users = selectUsers(state as any);
    expect(users).toHaveLength(1);
    expect(users[0].dateOfBirth).toBeInstanceOf(Date);
    expect(users[0].dateOfRegistration).toBeInstanceOf(Date);
    expect(users[0].lastLoginDatetime).toBeInstanceOf(Date);
  });

  it("selectors: selectUsersData возвращает users + isLoading", () => {
    const state = {
      usersData: {
        users: [makeUser()],
        isLoading: true,
        error: null,
      },
    };

    const data = selectUsersData(state as any);
    expect(data.isLoading).toBe(true);
    expect(data.users).toHaveLength(1);
  });

  // --- thunk tests для веток try/catch ---
  it("fetchUsersData thunk: Error -> rejected(payload=error.message)", async () => {
    jest.spyOn(api as any, "getUsers").mockRejectedValueOnce(new Error("boom"));

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchUsersData()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchUsersData.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("boom");
  });

  it("fetchUsersData thunk: non-Error -> rejected(payload=default)", async () => {
    jest.spyOn(api as any, "getUsers").mockRejectedValueOnce(null);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchUsersData()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchUsersData.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка загрузки данных");
  });

  it("updateUserInState thunk: Error -> rejected(payload=error.message)", async () => {
    jest.spyOn(api as any, "getUser").mockRejectedValueOnce(new Error("boom"));

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await updateUserInState(1)(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === updateUserInState.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("boom");
  });

  it("updateUserInState thunk: non-Error -> rejected(payload=default)", async () => {
    jest.spyOn(api as any, "getUser").mockRejectedValueOnce(undefined);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await updateUserInState(1)(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === updateUserInState.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка загрузки пользователя");
  });
});
