import { useEffect, useMemo, useState } from "react";
import { Card } from "@shared/ui/Card/Card";
import type { UserWithLikes } from "@entities/user/types";
import { useAppSelector } from "@app/store/hooks";
import { selectUser as selectAuthUser } from "@features/auth/model/slice";
import { api } from "@shared/api/api";
import type { Exchange } from "@entities/exchange/types";
import styles from "./requestsPage.module.scss";

export const Requests = () => {
  const authUser = useAppSelector(selectAuthUser);
  const [requests, setRequests] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      if (!authUser?.id) return;

      setIsLoading(true);
      setError(null);
      try {
        // Получаем все активные обмены со статусом accepted (и входящие, и исходящие)
        const data = await api.getUserExchanges(authUser.id, {
          status: "accepted",
          direction: "all",
        });
        setRequests(data);
      } catch (err: any) {
        console.error("Ошибка загрузки заявок:", err);
        setError(err?.message || "Не удалось загрузить заявки");
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [authUser?.id]);

  // Пользователи, которые отправили нам заявки (все входящие)
  const usersWithRequests = useMemo(() => {
    if (!authUser?.id) return [];

    return requests
      .map((req) => {
        // В заявках fromUser - это тот, кто отправил заявку
        const fromUser = req.fromUser;
        if (!fromUser) return null;

        // Формируем описание заявки
        const fromSkillName = req.fromSkill?.name || "Навык";
        const toSkillName = req.toSkill?.name || "Навык";
        const offerTitle = `${fromSkillName} ↔ ${toSkillName}`;

        return {
          id: fromUser.id,
          name: fromUser.name,
          username: "",
          email: "",
          avatarUrl: fromUser.avatarUrl || "",
          likes: 0,
          likesCount: 0,
          isLikedByCurrentUser: false,
          cityId: 0,
          dateOfBirth: new Date(),
          gender: "M",
          dateOfRegistration: new Date(),
          lastLoginDatetime: new Date(),
          exchangeId: req.id.toString(),
          exchangeStatus: req.status,
          offerTitle,
        } as UserWithLikes & {
          exchangeId: string;
          exchangeStatus: string;
          offerTitle: string;
        };
      })
      .filter(
        (
          u,
        ): u is UserWithLikes & {
          exchangeId: string;
          exchangeStatus: string;
          offerTitle: string;
        } => Boolean(u),
      );
  }, [requests, authUser?.id]);

  const handleAction = async (exchangeId: string, currentStatus: string) => {
    if (!authUser?.id) return;

    try {
      if (currentStatus === "accepted") {
        // Завершаем обмен - меняем статус на completed
        const updatedExchange = await api.updateExchangeStatus(
          parseInt(exchangeId, 10),
          "completed",
        );

        // Удаляем из списка (завершенные обмены не показываются в "Заявки")
        setRequests((prev) =>
          prev.filter((req) => req.id !== updatedExchange.id),
        );
      }
    } catch (err: any) {
      console.error("Ошибка при завершении обмена:", err);
      alert(err?.message || "Не удалось завершить обмен");
    }
  };

  if (isLoading) {
    return (
      <>
        <h1 className={styles.title}>Заявки</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Загрузка...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1 className={styles.title}>Заявки</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>{error}</p>
        </div>
      </>
    );
  }

  if (usersWithRequests.length === 0) {
    return (
      <>
        <h1 className={styles.title}>Заявки</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>У вас пока нет активных обменов</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Заявки</h1>
      <p className={styles.subtitle}>
        Активных обменов: {usersWithRequests.length}
      </p>
      <div className={styles.cardsGrid}>
        {usersWithRequests.map((user) => {
          return (
            <Card
              key={`${user.id}-${user.exchangeId}`}
              user={user}
              cities={[]}
              description={user.offerTitle}
              buttonText="Завершить"
              onDetailsClick={() =>
                handleAction(user.exchangeId, user.exchangeStatus)
              }
            />
          );
        })}
      </div>
    </>
  );
};
