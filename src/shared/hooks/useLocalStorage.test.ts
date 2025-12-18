import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("берёт значение из localStorage если оно есть", () => {
    localStorage.setItem("k", JSON.stringify({ x: 1 }));
    const { result } = renderHook(() => useLocalStorage("k", { x: 0 }));
    expect(result.current[0]).toEqual({ x: 1 });
  });

  it("использует initialValue при отсутствии значения", () => {
    const { result } = renderHook(() => useLocalStorage("k", 123));
    expect(result.current[0]).toBe(123);
  });

  it("использует initialValue если JSON сломан", () => {
    localStorage.setItem("k", "{not-json");
    const { result } = renderHook(() => useLocalStorage("k", "init"));
    expect(result.current[0]).toBe("init");
  });

  it("пишет в localStorage при изменении state", () => {
    const spy = jest.spyOn(Storage.prototype, "setItem");
    const { result } = renderHook(() => useLocalStorage("k", 1));

    act(() => {
      const [, setState] = result.current;
      setState(2);
    });

    expect(spy).toHaveBeenCalled();
    expect(localStorage.getItem("k")).toBe(JSON.stringify(2));
  });
});
