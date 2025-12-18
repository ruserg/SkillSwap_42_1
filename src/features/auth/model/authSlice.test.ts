import { api } from "@shared/api/api";
import type { User } from "@entities/user/types";
import {
  authReducer,
  changePassword,
  clearError,
  fetchUser,
  login,
  logout,
  register,
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
  updateCurrentUser,
} from "./slice";

jest.mock("@shared/lib/cookies", () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  removeCookie: jest.fn(),
}));

const cookies = jest.requireMock("@shared/lib/cookies") as {
  getCookie: jest.Mock;
  setCookie: jest.Mock;
  removeCookie: jest.Mock;
};

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  email: "test@example.com",
  name: "User",
  dateOfBirth: "2000-01-01",
  gender: "M",
  cityId: 1,
  avatarUrl: "https://example.com/avatar.jpg",
  about: "About",
  dateOfRegistration: "2024-01-01",
  lastLoginDatetime: "2024-01-02",
  ...overrides,
});

describe("auth slice (reducer/selectors)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("clearError сбрасывает error", () => {
    const prev = {
      user: null,
      refreshToken: null,
      isLoading: false,
      error: "boom",
    };

    const next = authReducer(prev as any, clearError());
    expect(next.error).toBeNull();
  });

  it("selectors: selectIsAuthenticated=true если есть токен и isLoading=true", () => {
    cookies.getCookie.mockReturnValue("token");

    const state = {
      auth: {
        user: null,
        refreshToken: null,
        isLoading: true,
        error: null,
      },
    };

    expect(selectIsAuthenticated(state as any)).toBe(true);
  });

  it("extraReducers: fetchUser.pending/fulfilled/rejected меняют state и чистят токены на rejected", () => {
    cookies.getCookie.mockReturnValue("token");
    localStorage.setItem("refreshToken", "rt");

    const prev = {
      user: makeUser({ id: 1 }),
      refreshToken: "rt",
      isLoading: false,
      error: "old",
    };

    const p = authReducer(prev as any, fetchUser.pending("r1", undefined));
    expect(p.isLoading).toBe(true);
    expect(p.error).toBeNull();

    const f = authReducer(
      p as any,
      fetchUser.fulfilled(makeUser({ id: 2 }) as any, "r1", undefined),
    );
    expect(f.isLoading).toBe(false);
    expect(f.user?.id).toBe(2);

    const lsSpy = jest.spyOn(Storage.prototype, "removeItem");
    const r = authReducer(
      f as any,
      fetchUser.rejected(new Error("x"), "r2", undefined, "fail"),
    );
    expect(r.isLoading).toBe(false);
    expect(r.error).toBe("fail");
    expect(r.user).toBeNull();
    expect(r.refreshToken).toBeNull();
    expect(cookies.removeCookie).toHaveBeenCalledWith("accessToken");
    expect(lsSpy).toHaveBeenCalledWith("refreshToken");
  });

  it("extraReducers: login.pending/fulfilled/rejected", () => {
    const prev = {
      user: null,
      refreshToken: null,
      isLoading: false,
      error: "old",
    };

    const p = authReducer(
      prev as any,
      login.pending("r1", { email: "a", password: "b" } as any),
    );
    expect(p.isLoading).toBe(true);
    expect(p.error).toBeNull();

    const f = authReducer(
      p as any,
      login.fulfilled(
        { user: makeUser({ id: 3 }), refreshToken: "rt" } as any,
        "r1",
        { email: "a", password: "b" } as any,
      ),
    );
    expect(f.isLoading).toBe(false);
    expect(f.user?.id).toBe(3);
    expect(f.refreshToken).toBe("rt");

    const r = authReducer(
      f as any,
      login.rejected(
        new Error("x"),
        "r2",
        { email: "a", password: "b" } as any,
        "bad",
      ),
    );
    expect(r.isLoading).toBe(false);
    expect(r.error).toBe("bad");
  });

  it("extraReducers: register.fulfilled/rejected", () => {
    const prev = {
      user: null,
      refreshToken: null,
      isLoading: true,
      error: null,
    };

    const f = authReducer(
      prev as any,
      register.fulfilled(
        { user: makeUser({ id: 4 }), refreshToken: "rt2" } as any,
        "r1",
        {} as any,
      ),
    );
    expect(f.isLoading).toBe(false);
    expect(f.user?.id).toBe(4);
    expect(f.refreshToken).toBe("rt2");

    const r = authReducer(
      f as any,
      register.rejected(new Error("x"), "r2", {} as any, "reg fail"),
    );
    expect(r.isLoading).toBe(false);
    expect(r.error).toBe("reg fail");
  });

  it("extraReducers: logout.fulfilled/rejected очищает user/refreshToken", () => {
    const prev = {
      user: makeUser(),
      refreshToken: "rt",
      isLoading: true,
      error: null,
    };

    const f = authReducer(
      prev as any,
      logout.fulfilled(null as any, "r1", undefined),
    );
    expect(f.isLoading).toBe(false);
    expect(f.user).toBeNull();
    expect(f.refreshToken).toBeNull();
    expect(f.error).toBeNull();

    const r = authReducer(
      prev as any,
      logout.rejected(new Error("x"), "r2", undefined, "logout fail"),
    );
    expect(r.isLoading).toBe(false);
    expect(r.user).toBeNull();
    expect(r.refreshToken).toBeNull();
    expect(r.error).toBe("logout fail");
  });

  it("extraReducers: updateCurrentUser.fulfilled/rejected", () => {
    const prev = {
      user: makeUser({ id: 1 }),
      refreshToken: null,
      isLoading: true,
      error: null,
    };

    const f = authReducer(
      prev as any,
      updateCurrentUser.fulfilled(
        makeUser({ id: 1, name: "New" }) as any,
        "r1",
        {} as any,
      ),
    );
    expect(f.isLoading).toBe(false);
    expect(f.user?.name).toBe("New");
    expect(f.error).toBeNull();

    const r = authReducer(
      prev as any,
      updateCurrentUser.rejected(new Error("x"), "r2", {} as any, "upd fail"),
    );
    expect(r.isLoading).toBe(false);
    expect(r.error).toBe("upd fail");
  });

  it("extraReducers: changePassword.fulfilled/rejected", () => {
    const prev = {
      user: null,
      refreshToken: null,
      isLoading: true,
      error: null,
    };

    const f = authReducer(
      prev as any,
      changePassword.fulfilled({} as any, "r1", {} as any),
    );
    expect(f.isLoading).toBe(false);
    expect(f.error).toBeNull();

    const r = authReducer(
      prev as any,
      changePassword.rejected(new Error("x"), "r2", {} as any, "pass fail"),
    );
    expect(r.isLoading).toBe(false);
    expect(r.error).toBe("pass fail");
  });

  it("selectors: selectUser/selectIsLoading/selectIsAuthenticated (hasToken && hasUser)", () => {
    cookies.getCookie.mockReturnValue("token");

    const state = {
      auth: {
        user: makeUser({ id: 5 }),
        refreshToken: null,
        isLoading: false,
        error: null,
      },
    };

    expect(selectUser(state as any)?.id).toBe(5);
    expect(selectIsLoading(state as any)).toBe(false);
    expect(selectIsAuthenticated(state as any)).toBe(true);
  });

  it("selectors: selectIsAuthenticated=false если нет токена", () => {
    cookies.getCookie.mockReturnValue(undefined);

    const state = {
      auth: {
        user: makeUser({ id: 5 }),
        refreshToken: null,
        isLoading: false,
        error: null,
      },
    };

    expect(selectIsAuthenticated(state as any)).toBe(false);
  });
});

describe("auth slice (thunks)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("fetchUser thunk: success -> fulfilled(user)", async () => {
    jest
      .spyOn(api as any, "getCurrentUser")
      .mockResolvedValueOnce(makeUser({ id: 10 }));

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchUser()(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === fetchUser.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.id).toBe(10);
  });

  it("fetchUser thunk: Error -> rejected(payload=message)", async () => {
    jest
      .spyOn(api as any, "getCurrentUser")
      .mockRejectedValueOnce(new Error("boom"));

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchUser()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchUser.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("boom");
  });

  it("login thunk: success -> fulfilled, setCookie + refreshToken in localStorage", async () => {
    jest.spyOn(api as any, "login").mockResolvedValueOnce({
      accessToken: "at",
      refreshToken: "rt",
      user: makeUser({ id: 2 }),
    });

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await login({ email: "a@b.com", password: "p" } as any)(
      dispatch as any,
      getState,
      undefined,
    );

    const fulfilled = dispatched.find((a) => a?.type === login.fulfilled.type);
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.refreshToken).toBe("rt");
    expect(cookies.setCookie).toHaveBeenCalledWith("accessToken", "at");
    expect(localStorage.getItem("refreshToken")).toBe("rt");
  });

  it("login thunk: non-Error -> rejected(payload='Ошибка входа')", async () => {
    jest.spyOn(api as any, "login").mockRejectedValueOnce(null);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await login({ email: "a@b.com", password: "p" } as any)(
      dispatch as any,
      getState,
      undefined,
    );

    const rejected = dispatched.find((a) => a?.type === login.rejected.type);
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка входа");
  });

  it("register thunk: success -> fulfilled, setCookie + refreshToken in localStorage", async () => {
    jest.spyOn(api as any, "register").mockResolvedValueOnce({
      accessToken: "at2",
      refreshToken: "rt2",
      user: makeUser({ id: 3 }),
    });

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await register({} as any)(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === register.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(cookies.setCookie).toHaveBeenCalledWith("accessToken", "at2");
    expect(localStorage.getItem("refreshToken")).toBe("rt2");
  });

  it("register thunk: Error -> rejected(payload=message)", async () => {
    jest
      .spyOn(api as any, "register")
      .mockRejectedValueOnce(new Error("reg boom"));

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await register({} as any)(dispatch as any, getState, undefined);

    const rejected = dispatched.find((a) => a?.type === register.rejected.type);
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("reg boom");
  });

  it("logout thunk: если refreshToken есть -> вызывает api.logout и чистит токены", async () => {
    localStorage.setItem("refreshToken", "rt");
    jest.spyOn(api as any, "logout").mockResolvedValueOnce(undefined);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await logout()(dispatch as any, getState, undefined);

    expect((api as any).logout).toHaveBeenCalledWith({ refreshToken: "rt" });
    expect(cookies.removeCookie).toHaveBeenCalledWith("accessToken");
    expect(localStorage.getItem("refreshToken")).toBeNull();

    const fulfilled = dispatched.find((a) => a?.type === logout.fulfilled.type);
    expect(fulfilled).toBeDefined();
  });

  it("logout thunk: если refreshToken нет -> api.logout не вызывается, но токены чистятся", async () => {
    jest.spyOn(api as any, "logout");

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await logout()(dispatch as any, getState, undefined);

    expect((api as any).logout).not.toHaveBeenCalled();
    expect(cookies.removeCookie).toHaveBeenCalledWith("accessToken");
  });

  it("logout thunk: ошибка api.logout -> rejected, но токены всё равно очищаются", async () => {
    localStorage.setItem("refreshToken", "rt");
    jest.spyOn(api as any, "logout").mockRejectedValueOnce(new Error("fail"));

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await logout()(dispatch as any, getState, undefined);

    const rejected = dispatched.find((a) => a?.type === logout.rejected.type);
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("fail");

    expect(cookies.removeCookie).toHaveBeenCalledWith("accessToken");
    expect(localStorage.getItem("refreshToken")).toBeNull();
  });

  it("updateCurrentUser thunk: success -> fulfilled(user)", async () => {
    jest
      .spyOn(api as any, "updateCurrentUser")
      .mockResolvedValueOnce(makeUser({ id: 99 }));

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await updateCurrentUser({} as any)(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === updateCurrentUser.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.id).toBe(99);
  });

  it("updateCurrentUser thunk: non-Error -> rejected(payload=default)", async () => {
    jest.spyOn(api as any, "updateCurrentUser").mockRejectedValueOnce(null);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await updateCurrentUser({} as any)(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === updateCurrentUser.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка обновления профиля");
  });

  it("changePassword thunk: success -> fulfilled", async () => {
    jest
      .spyOn(api as any, "changePassword")
      .mockResolvedValueOnce({ ok: true });

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await changePassword({} as any)(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === changePassword.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload).toEqual({ ok: true });
  });

  it("changePassword thunk: non-Error -> rejected(payload=default)", async () => {
    jest.spyOn(api as any, "changePassword").mockRejectedValueOnce(undefined);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await changePassword({} as any)(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === changePassword.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка изменения пароля");
  });
});
