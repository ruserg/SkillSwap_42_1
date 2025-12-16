import { useEffect, useMemo, useState } from "react";
import { Card } from "@shared/ui/Card/Card";
import type { UserWithLikes } from "@entities/user/types";
import { useAppSelector } from "@app/store/hooks";
import { selectUser as selectAuthUser } from "@features/auth/model/slice";
import { selectUsers } from "@entities/user/model/slice";
import { selectCities } from "@entities/city/model/slice";
import { api } from "@shared/api/api";
import type { Exchange } from "@entities/exchange/types";
import styles from "./exchangesPage.module.scss";

export const Exchanges = () => {
  const authUser = useAppSelector(selectAuthUser);
  const users = useAppSelector(selectUsers);
  const { cities } = useAppSelector(selectCities);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExchanges = async () => {
      if (!authUser?.id) return;

      setIsLoading(true);
      setError(null);
      try {
        // Загружаем активные и завершенные обмены
        const [acceptedExchanges, completedExchanges] = await Promise.all([
          api.getUserExchanges(authUser.id, {
            status: "accepted",
            direction: "all",
          }),
          api.getUserExchanges(authUser.id, {
            status: "completed",
            direction: "all",
          }),
        ]);
        setExchanges([...acceptedExchanges, ...completedExchanges]);
      } catch (err: any) {
        console.error("Ошибка загрузки обменов:", err);
        setError(err?.message || "Не удалось загрузить обмены");
      } finally {
        setIsLoading(false);
      }
    };

    loadExchanges();
  }, [authUser?.id]);

  const usersWithExchanges = useMemo(() => {
    if (!authUser?.id) return [];

    return exchanges
      .map((ex) => {
        const otherUserId =
          ex.fromUserId === authUser.id ? ex.toUserId : ex.fromUserId;

        // Берем пользователя из Redux store по ID
        const user = users.find((u) => u.id === otherUserId);
        if (!user) return null;

        const fromSkillName = ex.fromSkill?.name || "Навык";
        const toSkillName = ex.toSkill?.name || "Навык";
        const offerTitle = `${fromSkillName} ↔ ${toSkillName}`;

        return {
          ...user,
          exchangeId: ex.id.toString(),
          exchangeStatus: ex.status,
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
  }, [exchanges, authUser?.id, users]);

  const handleCompleteExchange = async (exchangeId: string) => {
    if (!authUser?.id) return;

    try {
      const updatedExchange = await api.updateExchangeStatus(
        parseInt(exchangeId, 10),
        "completed",
      );

      // Обновляем статус в списке
      setExchanges((prev) =>
        prev.map((ex) => (ex.id === updatedExchange.id ? updatedExchange : ex)),
      );
    } catch (err: any) {
      console.error("Ошибка при завершении обмена:", err);
      alert(err?.message || "Не удалось завершить обмен");
    }
  };

  const handleDeleteExchange = async (exchangeId: string) => {
    if (!authUser?.id) return;

    if (!confirm("Вы уверены, что хотите удалить этот обмен?")) {
      return;
    }

    try {
      await api.deleteExchange(parseInt(exchangeId, 10));

      setExchanges((prev) =>
        prev.filter((ex) => ex.id.toString() !== exchangeId),
      );
    } catch (err: any) {
      console.error("Ошибка при удалении обмена:", err);
      alert(err?.message || "Не удалось удалить обмен");
    }
  };

  if (isLoading) {
    return (
      <>
        <h1 className={styles.title}>Мои обмены</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Загрузка...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1 className={styles.title}>Мои обмены</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>{error}</p>
        </div>
      </>
    );
  }

  if (usersWithExchanges.length === 0) {
    return (
      <>
        <h1 className={styles.title}>Мои обмены</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>У вас пока нет обменов</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Мои обмены</h1>
      <p className={styles.subtitle}>Обменов: {usersWithExchanges.length}</p>
      <div className={styles.cardsGrid}>
        {usersWithExchanges.map((user) => {
          // Для активных обменов показываем кнопку "Завершить"
          if (user.exchangeStatus === "accepted") {
            return (
              <Card
                key={`${user.id}-${user.exchangeId}`}
                user={user}
                cities={cities}
                description={user.offerTitle}
                buttonDeleteText="Завершить"
                onDeleteClick={() => handleCompleteExchange(user.exchangeId)}
              />
            );
          }

          // Для завершенных обменов показываем кнопку "Удалить"
          return (
            <Card
              key={`${user.id}-${user.exchangeId}`}
              user={user}
              cities={cities}
              description={user.offerTitle}
              buttonDeleteText="Удалить"
              onDeleteClick={() => handleDeleteExchange(user.exchangeId)}
            />
          );
        })}
      </div>
    </>
  );
};
