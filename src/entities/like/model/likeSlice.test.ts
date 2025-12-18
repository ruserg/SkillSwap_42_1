import { api } from "@shared/api/api";
import type { TUserLikesInfo } from "../types";
import {
  clearError,
  createLike,
  deleteLike,
  fetchUserLikesInfo,
  fetchUsersLikesInfo,
  likesReducer,
  selectUserLikesInfo,
  selectUsersLikesInfo,
} from "./slice";

type LikesState = ReturnType<typeof likesReducer>;

const makeInfo = (overrides: Partial<TUserLikesInfo> = {}): TUserLikesInfo => ({
  userId: 1,
  likesCount: 0,
  isLikedByCurrentUser: false,
  ...overrides,
});

describe("likes slice", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("initialState при неизвестном экшене", () => {
    const state = likesReducer(undefined, { type: "unknown" });
    expect(state).toEqual({
      usersLikesInfo: {},
      isLoading: false,
      error: null,
    });
  });

  it("clearError сбрасывает error", () => {
    const prev: LikesState = {
      usersLikesInfo: {},
      isLoading: false,
      error: "boom",
    };

    const next = likesReducer(prev, clearError());
    expect(next.error).toBeNull();
  });

  it("fetchUsersLikesInfo.pending ставит isLoading=true и error=null", () => {
    const prev: LikesState = {
      usersLikesInfo: { 1: makeInfo({ userId: 1, likesCount: 1 }) },
      isLoading: false,
      error: "old",
    };

    const next = likesReducer(prev, fetchUsersLikesInfo.pending("r1", [1, 2]));

    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
  });

  it("fetchUsersLikesInfo.fulfilled мержит usersLikesInfo по userId", () => {
    const prev: LikesState = {
      usersLikesInfo: { 1: makeInfo({ userId: 1, likesCount: 1 }) },
      isLoading: true,
      error: "old",
    };

    const payload = [
      makeInfo({ userId: 1, likesCount: 2, isLikedByCurrentUser: true }),
      makeInfo({ userId: 2, likesCount: 5, isLikedByCurrentUser: false }),
    ];

    const next = likesReducer(
      prev,
      fetchUsersLikesInfo.fulfilled(payload as any, "r1", [1, 2]),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.usersLikesInfo[1].likesCount).toBe(2);
    expect(next.usersLikesInfo[1].isLikedByCurrentUser).toBe(true);
    expect(next.usersLikesInfo[2].likesCount).toBe(5);
  });

  it("fetchUsersLikesInfo.rejected ставит isLoading=false и error из payload", () => {
    const prev: LikesState = {
      usersLikesInfo: {},
      isLoading: true,
      error: null,
    };

    const next = likesReducer(
      prev,
      fetchUsersLikesInfo.rejected(new Error("x"), "r1", [1, 2], "fail"),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe("fail");
  });

  it("fetchUserLikesInfo.pending ставит isLoading=true и error=null", () => {
    const prev: LikesState = {
      usersLikesInfo: {},
      isLoading: false,
      error: "old",
    };

    const next = likesReducer(prev, fetchUserLikesInfo.pending("r1", 1));
    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
  });

  it("fetchUserLikesInfo.fulfilled кладёт info в usersLikesInfo[userId]", () => {
    const prev: LikesState = {
      usersLikesInfo: {},
      isLoading: true,
      error: "old",
    };

    const payload = makeInfo({
      userId: 7,
      likesCount: 3,
      isLikedByCurrentUser: true,
    });

    const next = likesReducer(
      prev,
      fetchUserLikesInfo.fulfilled(payload as any, "r1", 7),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.usersLikesInfo[7]).toEqual(payload);
  });

  it("fetchUserLikesInfo.rejected ставит isLoading=false и error из payload", () => {
    const prev: LikesState = {
      usersLikesInfo: {},
      isLoading: true,
      error: null,
    };

    const next = likesReducer(
      prev,
      fetchUserLikesInfo.rejected(new Error("x"), "r1", 1, "bad"),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe("bad");
  });

  it("createLike.rejected кладёт error", () => {
    const prev: LikesState = {
      usersLikesInfo: {},
      isLoading: false,
      error: null,
    };

    const next = likesReducer(
      prev,
      createLike.rejected(new Error("x"), "r1", { toUserId: 1 }, "like failed"),
    );

    expect(next.error).toBe("like failed");
  });

  it("deleteLike.rejected кладёт error", () => {
    const prev: LikesState = {
      usersLikesInfo: {},
      isLoading: false,
      error: null,
    };

    const next = likesReducer(
      prev,
      deleteLike.rejected(new Error("x"), "r1", 1, "delete failed"),
    );

    expect(next.error).toBe("delete failed");
  });

  it("selectors: selectUserLikesInfo отдаёт дефолт если нет данных", () => {
    const state = {
      likes: {
        usersLikesInfo: {},
        isLoading: false,
        error: null,
      },
    };

    const sel = selectUserLikesInfo(10);
    expect(sel(state as any)).toEqual({
      userId: 10,
      likesCount: 0,
      isLikedByCurrentUser: false,
    });
  });

  it("selectors: selectUsersLikesInfo отдаёт массив (дефолты и найденные)", () => {
    const state = {
      likes: {
        usersLikesInfo: {
          1: makeInfo({ userId: 1, likesCount: 2, isLikedByCurrentUser: true }),
        },
        isLoading: false,
        error: null,
      },
    };

    const sel = selectUsersLikesInfo([1, 2]);
    const result = sel(state as any);

    expect(result).toHaveLength(2);
    expect(result[0].userId).toBe(1);
    expect(result[0].likesCount).toBe(2);
    expect(result[1]).toEqual({
      userId: 2,
      likesCount: 0,
      isLikedByCurrentUser: false,
    });
  });

  it("fetchUsersLikesInfo thunk: success -> fulfilled(payload array)", async () => {
    jest
      .spyOn(api, "getUsersLikesInfo")
      .mockResolvedValueOnce([
        makeInfo({ userId: 1, likesCount: 2 }),
        makeInfo({ userId: 2, likesCount: 5 }),
      ] as any);

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await fetchUsersLikesInfo([1, 2])(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === fetchUsersLikesInfo.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload).toHaveLength(2);
  });

  it("fetchUsersLikesInfo thunk: Error -> rejected(payload=message)", async () => {
    jest
      .spyOn(api, "getUsersLikesInfo")
      .mockRejectedValueOnce(new Error("boom"));

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await fetchUsersLikesInfo([1])(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchUsersLikesInfo.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("boom");
  });

  it("fetchUsersLikesInfo thunk: non-Error -> rejected(payload=default text)", async () => {
    jest.spyOn(api, "getUsersLikesInfo").mockRejectedValueOnce("nope");

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await fetchUsersLikesInfo([1])(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchUsersLikesInfo.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка загрузки информации о лайках");
  });

  it("fetchUserLikesInfo thunk: success -> fulfilled(payload object)", async () => {
    jest.spyOn(api, "getUserLikesInfo").mockResolvedValueOnce(
      makeInfo({
        userId: 7,
        likesCount: 3,
        isLikedByCurrentUser: true,
      }) as any,
    );

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await fetchUserLikesInfo(7)(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === fetchUserLikesInfo.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.userId).toBe(7);
  });

  it("fetchUserLikesInfo thunk: error -> rejected(payload=default text if non-Error)", async () => {
    jest.spyOn(api, "getUserLikesInfo").mockRejectedValueOnce(null);

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await fetchUserLikesInfo(7)(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchUserLikesInfo.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка загрузки информации о лайках");
  });

  it("createLike thunk: success -> fulfilled(payload=toUserId)", async () => {
    jest.spyOn(api, "createLike").mockResolvedValueOnce(undefined as any);

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await createLike({ toUserId: 5 })(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === createLike.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload).toBe(5);
  });

  it("createLike thunk: 'already exists' -> fulfilled(payload=toUserId)", async () => {
    jest
      .spyOn(api, "createLike")
      .mockRejectedValueOnce(new Error("already exists"));

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await createLike({ toUserId: 6 })(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === createLike.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload).toBe(6);
  });

  it("createLike thunk: other error -> rejected(payload=message)", async () => {
    jest.spyOn(api, "createLike").mockRejectedValueOnce(new Error("nope"));

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await createLike({ toUserId: 7 })(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === createLike.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("nope");
  });

  it("deleteLike thunk: success -> fulfilled(payload=toUserId)", async () => {
    jest
      .spyOn(api, "deleteLikeByUserId")
      .mockResolvedValueOnce(undefined as any);

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await deleteLike(9)(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === deleteLike.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload).toBe(9);
  });

  it("deleteLike thunk: error -> rejected(payload=default if non-Error)", async () => {
    jest.spyOn(api, "deleteLikeByUserId").mockRejectedValueOnce(undefined);

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await deleteLike(9)(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === deleteLike.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка удаления лайка");
  });
});
