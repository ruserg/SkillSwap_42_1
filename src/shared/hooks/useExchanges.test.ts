import { renderHook, act } from "@testing-library/react";
import { useExchanges } from "./useExchanges";

describe("useExchanges", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("инициализируется пустым списком если в localStorage ничего нет", () => {
    const { result } = renderHook(() => useExchanges("u1"));
    expect(result.current.exchanges).toEqual([]);
    expect(result.current.incomingRequests).toEqual([]);
    expect(result.current.activeExchanges).toEqual([]);
  });

  it("proposeExchange добавляет pending-обмен и сохраняет", () => {
    const { result } = renderHook(() => useExchanges("u2"));

    act(() => {
      result.current.proposeExchange({
        fromUserId: "u1",
        toUserId: "u2",
        fromSkillId: "s1",
        toSkillId: "s2",
        offerTitle: "Offer",
      });
    });

    expect(result.current.exchanges.length).toBe(1);
    expect(result.current.exchanges[0].status).toBe("pending");
    expect(result.current.incomingRequests.length).toBe(1);
    expect(localStorage.getItem("exchanges")).toContain("pending");
  });

  it("accept/finish/resume меняют статус", () => {
    const { result } = renderHook(() => useExchanges("u2"));

    act(() => {
      result.current.proposeExchange({
        fromUserId: "u1",
        toUserId: "u2",
        fromSkillId: "s1",
        toSkillId: "s2",
        offerTitle: "Offer",
      });
    });

    const id = result.current.exchanges[0].id;

    act(() => {
      result.current.acceptExchange(id);
    });
    expect(result.current.exchanges[0].status).toBe("accepted");
    expect(result.current.activeExchanges.length).toBe(1);

    act(() => {
      result.current.finishExchange(id);
    });
    expect(result.current.exchanges[0].status).toBe("completed");

    act(() => {
      result.current.resumeExchange(id);
    });
    expect(result.current.exchanges[0].status).toBe("pending");
  });
});
