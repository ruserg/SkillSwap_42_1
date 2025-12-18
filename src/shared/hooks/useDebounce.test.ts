import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("возвращает исходное значение сразу", () => {
    const { result } = renderHook(() => useDebounce("a", 200));
    expect(result.current).toBe("a");
  });

  it("обновляет значение только после delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 200 } },
    );

    expect(result.current).toBe("a");

    rerender({ value: "b", delay: 200 });
    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(199);
    });
    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("b");
  });

  it("очищает таймер при изменении значения (предыдущий не должен сработать)", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    rerender({ value: "c" });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe("c");
  });
});
