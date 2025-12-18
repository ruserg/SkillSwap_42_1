import { api } from "@shared/api/api";
import type { INotification } from "../types";
import {
  clearError,
  clearToast,
  deleteAllNotifications,
  deleteNotification,
  fetchNotificationById,
  fetchNotifications,
  fetchToastNotification,
  fetchUnreadNotifications,
  markAllNotificationsAsRead,
  markAsReadOptimistic,
  markNotificationAsRead,
  notificationsReducer,
  selectNotificationById,
  selectNotifications,
  selectNotificationsData,
  selectNotificationsLoading,
  selectToast,
  selectUnreadNotifications,
  selectUnreadNotificationsCount,
} from "./slice";

type NotificationsState = ReturnType<typeof notificationsReducer>;

const makeNotification = (
  overrides: Partial<INotification> = {},
): INotification => ({
  id: "n1",
  message: "Message",
  details: "Details",
  type: "success",
  date: "2024-01-01",
  to: 1,
  isRead: false,
  ...overrides,
});

describe("notifications slice (reducer/selectors)", () => {
  it("initialState при неизвестном экшене", () => {
    const state = notificationsReducer(undefined, { type: "unknown" });
    expect(state).toEqual({
      notifications: [],
      toast: null,
      isLoading: false,
      error: null,
    });
  });

  it("clearError сбрасывает error", () => {
    const prev: NotificationsState = {
      notifications: [],
      toast: null,
      isLoading: false,
      error: "boom",
    };
    const next = notificationsReducer(prev, clearError());
    expect(next.error).toBeNull();
  });

  it("clearToast сбрасывает toast", () => {
    const prev: NotificationsState = {
      notifications: [],
      toast: makeNotification({ id: "t1" }),
      isLoading: false,
      error: null,
    };
    const next = notificationsReducer(prev, clearToast());
    expect(next.toast).toBeNull();
  });

  it("markAsReadOptimistic помечает уведомление и toast как прочитанное", () => {
    const prev: NotificationsState = {
      notifications: [
        makeNotification({ id: "a", isRead: false }),
        makeNotification({ id: "b", isRead: false }),
      ],
      toast: makeNotification({ id: "b", isRead: false }),
      isLoading: false,
      error: null,
    };

    const next = notificationsReducer(prev, markAsReadOptimistic("b"));
    expect(next.notifications.find((n) => n.id === "b")!.isRead).toBe(true);
    expect(next.toast!.isRead).toBe(true);
  });

  it("fetchNotifications.pending ставит isLoading=true и сбрасывает error", () => {
    const prev: NotificationsState = {
      notifications: [],
      toast: null,
      isLoading: false,
      error: "old",
    };

    const next = notificationsReducer(
      prev,
      fetchNotifications.pending("r1", undefined),
    );

    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
  });

  it("fetchNotifications.fulfilled: если toast есть и он найден в списке — заменяет элемент на state.toast", () => {
    const toast = makeNotification({
      id: "t1",
      isRead: true,
      details: "TOAST",
    });

    const prev: NotificationsState = {
      notifications: [],
      toast,
      isLoading: true,
      error: null,
    };

    const payload = [
      makeNotification({ id: "x1" }),
      makeNotification({ id: "t1", isRead: false, details: "from-api" }),
      makeNotification({ id: "x2" }),
    ];

    const next = notificationsReducer(
      prev,
      fetchNotifications.fulfilled(payload as any, "r1", undefined),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.notifications).toHaveLength(3);

    const inList = next.notifications.find((n) => n.id === "t1")!;
    expect(inList.details).toBe("TOAST");
    expect(inList.isRead).toBe(true);
  });

  it("fetchNotifications.rejected кладёт error", () => {
    const prev: NotificationsState = {
      notifications: [],
      toast: null,
      isLoading: true,
      error: null,
    };

    const next = notificationsReducer(
      prev,
      fetchNotifications.rejected(new Error("x"), "r1", undefined, "fail"),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe("fail");
  });

  it("fetchUnreadNotifications.fulfilled: апдейтит существующие и добавляет новые", () => {
    const prev: NotificationsState = {
      notifications: [
        makeNotification({ id: "a", isRead: false, details: "old a" }),
        makeNotification({ id: "b", isRead: true, details: "old b" }),
      ],
      toast: null,
      isLoading: true,
      error: null,
    };

    const payload = [
      makeNotification({ id: "a", isRead: false, details: "new a" }),
      makeNotification({ id: "c", isRead: false, details: "new c" }),
    ];

    const next = notificationsReducer(
      prev,
      fetchUnreadNotifications.fulfilled(payload as any, "r1", undefined),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.notifications.find((n) => n.id === "a")!.details).toBe("new a");
    expect(next.notifications.find((n) => n.id === "c")).toBeDefined();
  });

  it("fetchToastNotification.fulfilled кладёт toast и не добавляет в notifications", () => {
    const prev: NotificationsState = {
      notifications: [makeNotification({ id: "a" })],
      toast: null,
      isLoading: false,
      error: null,
    };

    const toast = makeNotification({ id: "t1" });

    const next = notificationsReducer(
      prev,
      fetchToastNotification.fulfilled(toast as any, "r1", undefined),
    );

    expect(next.toast?.id).toBe("t1");
    expect(next.notifications).toHaveLength(1);
    expect(next.notifications.find((n) => n.id === "t1")).toBeUndefined();
  });

  it("fetchNotificationById.fulfilled: апсерт по id", () => {
    const prev: NotificationsState = {
      notifications: [makeNotification({ id: "a", details: "old" })],
      toast: null,
      isLoading: false,
      error: null,
    };

    const updated = makeNotification({ id: "a", details: "updated" });
    const next1 = notificationsReducer(
      prev,
      fetchNotificationById.fulfilled(updated as any, "r1", "a"),
    );
    expect(next1.notifications.find((n) => n.id === "a")!.details).toBe(
      "updated",
    );

    const newOne = makeNotification({ id: "b" });
    const next2 = notificationsReducer(
      prev,
      fetchNotificationById.fulfilled(newOne as any, "r2", "b"),
    );
    expect(next2.notifications.find((n) => n.id === "b")).toBeDefined();
  });

  it("markNotificationAsRead.fulfilled обновляет notification и toast, если совпали id", () => {
    const prev: NotificationsState = {
      notifications: [makeNotification({ id: "a", isRead: false })],
      toast: makeNotification({ id: "a", isRead: false }),
      isLoading: false,
      error: null,
    };

    const updated = makeNotification({ id: "a", isRead: true });

    const next = notificationsReducer(
      prev,
      markNotificationAsRead.fulfilled(updated as any, "r1", "a"),
    );

    expect(next.notifications.find((n) => n.id === "a")!.isRead).toBe(true);
    expect(next.toast!.isRead).toBe(true);
  });

  it("markAllNotificationsAsRead.fulfilled обновляет уведомления из payload и toast", () => {
    const prev: NotificationsState = {
      notifications: [
        makeNotification({ id: "a", isRead: false }),
        makeNotification({ id: "b", isRead: false }),
      ],
      toast: makeNotification({ id: "b", isRead: false }),
      isLoading: false,
      error: null,
    };

    const payload = {
      notifications: [
        makeNotification({ id: "a", isRead: true }),
        makeNotification({ id: "b", isRead: true }),
      ],
    };

    const next = notificationsReducer(
      prev,
      markAllNotificationsAsRead.fulfilled(payload as any, "r1", undefined),
    );

    expect(next.notifications.every((n) => n.isRead)).toBe(true);
    expect(next.toast!.isRead).toBe(true);
  });

  it("deleteNotification.fulfilled удаляет из списка и очищает toast если совпал id", () => {
    const prev: NotificationsState = {
      notifications: [
        makeNotification({ id: "a" }),
        makeNotification({ id: "b" }),
      ],
      toast: makeNotification({ id: "b" }),
      isLoading: false,
      error: null,
    };

    const next = notificationsReducer(
      prev,
      deleteNotification.fulfilled("b" as any, "r1", "b"),
    );

    expect(next.notifications.find((n) => n.id === "b")).toBeUndefined();
    expect(next.toast).toBeNull();
  });

  it("deleteAllNotifications.fulfilled очищает notifications и toast", () => {
    const prev: NotificationsState = {
      notifications: [makeNotification({ id: "a" })],
      toast: makeNotification({ id: "t1" }),
      isLoading: false,
      error: null,
    };

    const next = notificationsReducer(
      prev,
      deleteAllNotifications.fulfilled(undefined as any, "r1", undefined),
    );

    expect(next.notifications).toEqual([]);
    expect(next.toast).toBeNull();
  });

  it("selectors: unread/count/toast/byId/data/loading", () => {
    const state = {
      notifications: {
        notifications: [
          makeNotification({ id: "a", isRead: false }),
          makeNotification({ id: "b", isRead: true }),
        ],
        toast: makeNotification({ id: "t1" }),
        isLoading: true,
        error: "e",
      },
    };

    expect(selectNotifications(state as any)).toHaveLength(2);
    expect(selectUnreadNotifications(state as any)).toHaveLength(1);
    expect(selectUnreadNotificationsCount(state as any)).toBe(1);

    expect(selectToast(state as any)?.id).toBe("t1");

    const selById = selectNotificationById("a");
    expect(selById(state as any)?.id).toBe("a");

    expect(selectNotificationsLoading(state as any)).toBe(true);

    const data = selectNotificationsData(state as any);
    expect(data.isLoading).toBe(true);
    expect(data.error).toBe("e");
    expect(data.notifications).toHaveLength(2);
  });
});

describe("notifications slice (thunks)", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("fetchNotifications thunk: success -> fulfilled", async () => {
    jest
      .spyOn(api, "getNotifications")
      .mockResolvedValueOnce([makeNotification({ id: "a" })] as any);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchNotifications()(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === fetchNotifications.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload).toHaveLength(1);
  });

  it("fetchNotifications thunk: Error -> rejected(payload=message)", async () => {
    jest
      .spyOn(api, "getNotifications")
      .mockRejectedValueOnce(new Error("boom"));

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchNotifications()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchNotifications.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("boom");
  });

  it("fetchUnreadNotifications thunk: non-Error -> rejected(payload=default)", async () => {
    jest.spyOn(api, "getUnreadNotifications").mockRejectedValueOnce(null);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchUnreadNotifications()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchUnreadNotifications.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка загрузки непрочитанных уведомлений");
  });

  it("fetchToastNotification thunk: success -> fulfilled", async () => {
    jest
      .spyOn(api, "getToastNotification")
      .mockResolvedValueOnce(makeNotification({ id: "t1" }) as any);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchToastNotification()(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === fetchToastNotification.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.id).toBe("t1");
  });

  it("fetchToastNotification thunk: Error -> rejected(payload=message)", async () => {
    jest
      .spyOn(api, "getToastNotification")
      .mockRejectedValueOnce(new Error("toast fail"));

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchToastNotification()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchToastNotification.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("toast fail");
  });

  it("fetchNotificationById thunk: success -> fulfilled", async () => {
    jest
      .spyOn(api, "getNotificationById")
      .mockResolvedValueOnce(makeNotification({ id: "x" }) as any);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await fetchNotificationById("x")(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === fetchNotificationById.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.id).toBe("x");
  });

  it("markNotificationAsRead thunk: non-Error -> rejected(payload=default)", async () => {
    jest.spyOn(api, "markNotificationAsRead").mockRejectedValueOnce(undefined);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await markNotificationAsRead("x")(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === markNotificationAsRead.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe(
      "Ошибка отметки уведомления как прочитанного",
    );
  });

  it("markAllNotificationsAsRead thunk: success -> fulfilled(payload.notifications)", async () => {
    jest.spyOn(api, "markAllNotificationsAsRead").mockResolvedValueOnce({
      notifications: [
        makeNotification({ id: "a", isRead: true }),
        makeNotification({ id: "b", isRead: true }),
      ],
    } as any);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await markAllNotificationsAsRead()(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === markAllNotificationsAsRead.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.notifications).toHaveLength(2);
  });

  it("deleteNotification thunk: success -> fulfilled(payload=id)", async () => {
    jest
      .spyOn(api, "deleteNotification")
      .mockResolvedValueOnce(undefined as any);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await deleteNotification("z")(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === deleteNotification.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload).toBe("z");
  });

  it("deleteAllNotifications thunk: non-Error -> rejected(payload=default)", async () => {
    jest.spyOn(api, "deleteAllNotifications").mockRejectedValueOnce(null);

    const dispatched: any[] = [];
    const dispatch = (a: any) => (dispatched.push(a), a);
    const getState = () => ({}) as any;

    await deleteAllNotifications()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === deleteAllNotifications.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка удаления всех уведомлений");
  });
});
