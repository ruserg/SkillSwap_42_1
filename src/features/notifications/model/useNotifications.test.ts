import { renderHook, act } from "@testing-library/react";
import { defaultNotifications, useNotifications } from "./useNotifications";

describe("useNotifications", () => {
  it("инициализируется defaultNotifications", () => {
    const { result } = renderHook(() => useNotifications());
    expect(result.current.notifications).toEqual(defaultNotifications);
  });

  it("правильно вычисляет newNotifications и viewedNotifications на дефолтных данных", () => {
    const { result } = renderHook(() => useNotifications());

    const unread = result.current.notifications.filter((n) => !n.isRead);
    const read = result.current.notifications.filter((n) => n.isRead);

    expect(result.current.newNotifications).toEqual(unread);
    expect(result.current.viewedNotifications).toEqual(read);

    expect(result.current.newNotifications.every((n) => !n.isRead)).toBe(true);
    expect(result.current.viewedNotifications.every((n) => n.isRead)).toBe(
      true,
    );
  });

  it("setNotifications обновляет списки new/viewed", () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.setNotifications([
        {
          id: "x",
          message: "Msg",
          details: "Det",
          type: "warning",
          date: "today",
          action: "Go",
          to: 1,
          isRead: false,
        },
        {
          id: "y",
          message: "Msg2",
          details: "Det2",
          type: "success",
          date: "today",
          action: "Go",
          to: 1,
          isRead: true,
        },
      ]);
    });

    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.newNotifications).toHaveLength(1);
    expect(result.current.viewedNotifications).toHaveLength(1);
    expect(result.current.newNotifications[0].id).toBe("x");
    expect(result.current.viewedNotifications[0].id).toBe("y");
  });
});
