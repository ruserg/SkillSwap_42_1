import { useEffect, useState } from "react";

export type ExchangeStatus = "pending" | "accepted" | "completed" | "cancelled";

export interface Exchange {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromSkillId: string;
  toSkillId: string;
  status: ExchangeStatus;
  offerTitle: string;
  createdAt: string;
  updatedAt?: string;
  fromUserName?: string;
  toUserName?: string;
}

const STORAGE_KEY = "exchanges";

export const useExchanges = (currentUserId: string) => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setExchanges(JSON.parse(saved));
    }
  }, []);

  const save = (data: Exchange[]) => {
    setExchanges(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const proposeExchange = (
    data: Omit<Exchange, "id" | "status" | "createdAt">,
  ) => {
    const exchange: Exchange = {
      ...data,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    save([exchange, ...exchanges]);
  };

  const acceptExchange = (id: string) => {
    save(
      exchanges.map((e) => (e.id === id ? { ...e, status: "accepted" } : e)),
    );
  };

  const finishExchange = (id: string) => {
    save(
      exchanges.map((e) => (e.id === id ? { ...e, status: "completed" } : e)),
    );
  };

  const resumeExchange = (id: string) => {
    save(exchanges.map((e) => (e.id === id ? { ...e, status: "pending" } : e)));
  };

  const incomingRequests = exchanges.filter(
    (e) => e.status === "pending" && e.toUserId === currentUserId,
  );

  const activeExchanges = exchanges.filter(
    (e) =>
      e.status !== "pending" &&
      (e.fromUserId === currentUserId || e.toUserId === currentUserId),
  );

  return {
    exchanges,
    incomingRequests,
    activeExchanges,
    proposeExchange,
    acceptExchange,
    finishExchange,
    resumeExchange,
  };
};
