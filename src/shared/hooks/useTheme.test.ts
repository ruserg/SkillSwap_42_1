import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.removeAttribute("data-theme");

    // matchMedia уже замокан в setupTests.ts; здесь лишь гарантируем дефолт
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: false, // light
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it("по умолчанию preference=auto и выставляет эффективную тему по системе", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.preference).toBe("auto");
    expect(result.current.effective).toBe("light");
    expect(document.body.getAttribute("data-theme")).toBeNull();
  });

  it("setTheme('dark') выставляет data-theme=dark и сохраняет в localStorage", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.preference).toBe("dark");
    expect(result.current.effective).toBe("dark");
    expect(document.body.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe(JSON.stringify("dark"));
  });

  it("toggle переключает dark <-> light", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("dark");
    });
    expect(result.current.preference).toBe("dark");
    expect(document.body.getAttribute("data-theme")).toBe("dark");

    act(() => {
      result.current.toggle();
    });
    expect(result.current.preference).toBe("light");
    expect(document.body.getAttribute("data-theme")).toBeNull();
  });
});
