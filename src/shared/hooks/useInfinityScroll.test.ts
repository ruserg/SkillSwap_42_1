import { renderHook, act } from "@testing-library/react";
import { useInfinityScroll } from "./useInfinityScroll";

describe("useInfinityScroll", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    (window.scrollTo as any) = jest.fn();

    // Делаем управляемый IntersectionObserver для теста
    let savedCb: IntersectionObserverCallback | null = null;

    (global as any).IntersectionObserver = jest.fn(
      (cb: IntersectionObserverCallback) => {
        savedCb = cb;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
          takeRecords: jest.fn(),
        };
      },
    );

    (global as any).__io_fire = (isIntersecting: boolean) => {
      if (!savedCb) return;
      const entry = [
        { isIntersecting },
      ] as unknown as IntersectionObserverEntry[];
      savedCb(entry, {} as IntersectionObserver);
    };
  });

  it("loadMoreList активирует секцию", () => {
    const setSectionActive = jest.fn((updater: any) =>
      updater({ popular: false, new: false }),
    );

    const { result } = renderHook(() =>
      useInfinityScroll({
        triggerArray: [{ id: 1 } as any],
        isSectionActive: { popular: false, new: false },
        scrollSection: "popular",
        nextNumber: 3,
        setCountState: jest.fn(),
        setSectionActive,
        sentinelRef: { current: document.createElement("div") } as any,
      }),
    );

    act(() => {
      result.current.loadMoreList();
    });

    expect(setSectionActive).toHaveBeenCalled();
  });

  it("hideMoreList скроллит вверх, ставит count и деактивирует секцию", () => {
    const setCountState = jest.fn();
    const setSectionActive = jest.fn((updater: any) =>
      updater({ popular: true, new: false }),
    );

    const { result } = renderHook(() =>
      useInfinityScroll({
        triggerArray: [{ id: 1 } as any],
        isSectionActive: { popular: true, new: false },
        scrollSection: "popular",
        nextNumber: 3,
        setCountState,
        setSectionActive,
        sentinelRef: { current: document.createElement("div") } as any,
      }),
    );

    act(() => {
      result.current.hideMoreList(3);
    });

    expect(window.scrollTo).toHaveBeenCalled();
    expect(setCountState).toHaveBeenCalledWith(3);
    expect(setSectionActive).toHaveBeenCalled();
  });

  it("увеличивает count при пересечении sentinel", () => {
    const setCountState = jest.fn((updater: any) => updater(0));
    const sentinel = document.createElement("div");

    // чтобы сработала ветка isElementInViewport (не обязательно, но ускоряет покрытие)
    sentinel.getBoundingClientRect = () => ({ top: 0, bottom: 10 }) as any;
    Object.defineProperty(window, "innerHeight", {
      value: 100,
      writable: true,
    });

    renderHook(() =>
      useInfinityScroll({
        triggerArray: [
          { id: 1 } as any,
          { id: 2 } as any,
          { id: 3 } as any,
          { id: 4 } as any,
        ],
        isSectionActive: { popular: true, new: false },
        scrollSection: "popular",
        nextNumber: 3,
        setCountState,
        setSectionActive: jest.fn(),
        sentinelRef: { current: sentinel } as any,
      }),
    );

    act(() => {
      (global as any).__io_fire(true);
    });

    expect(setCountState).toHaveBeenCalled();
  });
});
