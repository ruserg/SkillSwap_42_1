import { useEffect, useMemo, useState } from "react";
import { Card } from "@shared/ui/Card/Card";
import type { UserWithLikes } from "@entities/user/types";
import { useAppSelector } from "@app/store/hooks";
import { selectUser as selectAuthUser } from "@features/auth/model/slice";
import { selectUsers } from "@entities/user/model/slice";
import { selectCities } from "@entities/city/model/slice";
import { api } from "@shared/api/api";
import type { Exchange } from "@entities/exchange/types";
import styles from "./requestsPage.module.scss";

export const Requests = () => {
  const authUser = useAppSelector(selectAuthUser);
  const users = useAppSelector(selectUsers);
  const { cities } = useAppSelector(selectCities);
  const [requests, setRequests] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      if (!authUser?.id) return;

      setIsLoading(true);
      setError(null);
      try {
        const data = await api.getUserExchanges(authUser.id, {
          status: "pending",
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

  const usersWithRequests = useMemo(() => {
    if (!authUser?.id) return [];

    return requests
      .map((req) => {
        const isIncoming = req.toUserId === authUser.id;
        const otherUserId = isIncoming ? req.fromUserId : req.toUserId;

        // Берем пользователя из Redux store по ID
        const user = users.find((u) => u.id === otherUserId);
        if (!user) return null;

        const fromSkillName = req.fromSkill?.name || "Навык";
        const toSkillName = req.toSkill?.name || "Навык";
        const offerTitle = `${fromSkillName} ↔ ${toSkillName}`;

        return {
          ...user,
          exchangeId: req.id.toString(),
          exchangeStatus: req.status,
          offerTitle,
          isIncoming,
        } as UserWithLikes & {
          exchangeId: string;
          exchangeStatus: string;
          offerTitle: string;
          isIncoming: boolean;
        };
      })
      .filter(
        (
          u,
        ): u is UserWithLikes & {
          exchangeId: string;
          exchangeStatus: string;
          offerTitle: string;
          isIncoming: boolean;
        } => Boolean(u),
      );
  }, [requests, authUser?.id, users]);

  const handleAccept = async (exchangeId: string) => {
    if (!authUser?.id) return;

    try {
      const updatedExchange = await api.updateExchangeStatus(
        parseInt(exchangeId, 10),
        "accepted",
      );

      // Удаляем из списка (принятые заявки переходят в активные обмены)
      setRequests((prev) =>
        prev.filter((req) => req.id !== updatedExchange.id),
      );
    } catch (err: any) {
      console.error("Ошибка при принятии заявки:", err);
      alert(err?.message || "Не удалось принять заявку");
    }
  };

  const handleReject = async (exchangeId: string) => {
    if (!authUser?.id) return;

    try {
      await api.deleteExchange(parseInt(exchangeId, 10));

      // Удаляем из списка
      setRequests((prev) =>
        prev.filter((req) => req.id.toString() !== exchangeId),
      );
    } catch (err: any) {
      console.error("Ошибка при отклонении заявки:", err);
      alert(err?.message || "Не удалось отклонить заявку");
    }
  };

  const handleCancel = async (exchangeId: string) => {
    if (!authUser?.id) return;

    if (!confirm("Вы уверены, что хотите отозвать эту заявку?")) {
      return;
    }

    try {
      await api.deleteExchange(parseInt(exchangeId, 10));

      // Удаляем из списка
      setRequests((prev) =>
        prev.filter((req) => req.id.toString() !== exchangeId),
      );
    } catch (err: any) {
      console.error("Ошибка при отзыве заявки:", err);
      alert(err?.message || "Не удалось отозвать заявку");
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
          <p className={styles.emptyText}>У вас пока нет заявок на обмен</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Заявки</h1>
      <p className={styles.subtitle}>
        Заявок на обмен: {usersWithRequests.length}
      </p>
      <div className={styles.cardsGrid}>
        {usersWithRequests.map((user) => {
          // Для входящих заявок показываем кнопки "Принять" и "Отклонить" внутри карточки
          if (user.isIncoming) {
            return (
              <Card
                key={`${user.id}-${user.exchangeId}`}
                user={user}
                cities={cities}
                description={user.offerTitle}
                onAcceptClick={() => handleAccept(user.exchangeId)}
                onRejectClick={() => handleReject(user.exchangeId)}
                buttonAcceptText="Принять"
                buttonRejectText="Отклонить"
              />
            );
          }

          // Для исходящих заявок показываем кнопку "Отозвать заявку" внутри карточки
          return (
            <Card
              key={`${user.id}-${user.exchangeId}`}
              user={user}
              cities={cities}
              description={user.offerTitle}
              onCancelClick={() => handleCancel(user.exchangeId)}
              buttonCancelText="Отозвать заявку"
            />
          );
        })}
      </div>
    </>
  );
};
