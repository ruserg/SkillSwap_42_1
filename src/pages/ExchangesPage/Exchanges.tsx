import { useEffect, useMemo, useState } from "react";
import { Card } from "@shared/ui/Card/Card";
import type { UserWithLikes } from "@entities/user/types";
import { useAppSelector } from "@app/store/hooks";
import { selectUser as selectAuthUser } from "@features/auth/model/slice";
import { api } from "@shared/api/api";
import type { Exchange } from "@entities/exchange/types";
import styles from "./exchangesPage.module.scss";

export const Exchanges = () => {
  const authUser = useAppSelector(selectAuthUser);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExchanges = async () => {
      if (!authUser?.id) return;

      setIsLoading(true);
      setError(null);
      try {
        // Получаем все завершенные обмены пользователя (и входящие, и исходящие)
        // со статусом completed
        const data = await api.getUserExchanges(authUser.id, {
          status: "completed",
          direction: "all",
        });
        setExchanges(data);
      } catch (err: any) {
        console.error("Ошибка загрузки обменов:", err);
        setError(err?.message || "Не удалось загрузить обмены");
      } finally {
        setIsLoading(false);
      }
    };

    loadExchanges();
  }, [authUser?.id]);

  // Формируем список пользователей с завершенными обменами
  const usersWithExchanges = useMemo(() => {
    if (!authUser?.id) return [];

    return exchanges
      .map((ex) => {
        // Определяем другого участника обмена
        const otherUser =
          ex.fromUserId === authUser.id ? ex.toUser : ex.fromUser;
        if (!otherUser) return null;

        // Формируем описание обмена
        const fromSkillName = ex.fromSkill?.name || "Навык";
        const toSkillName = ex.toSkill?.name || "Навык";
        const offerTitle = `${fromSkillName} ↔ ${toSkillName}`;

        return {
          id: otherUser.id,
          name: otherUser.name,
          username: "",
          email: "",
          avatarUrl: otherUser.avatarUrl || "",
          likes: 0,
          likesCount: 0,
          isLikedByCurrentUser: false,
          cityId: 0,
          dateOfBirth: new Date(),
          gender: "M",
          dateOfRegistration: new Date(),
          lastLoginDatetime: new Date(),
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
  }, [exchanges, authUser?.id]);

  const handleDeleteExchange = async (exchangeId: string) => {
    if (!authUser?.id) return;

    if (!confirm("Вы уверены, что хотите удалить этот обмен?")) {
      return;
    }

    try {
      await api.deleteExchange(parseInt(exchangeId, 10));

      // Удаляем из списка
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
          <p className={styles.emptyText}>У вас пока нет завершенных обменов</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Мои обмены</h1>
      <p className={styles.subtitle}>
        Завершенных обменов: {usersWithExchanges.length}
      </p>
      <div className={styles.cardsGrid}>
        {usersWithExchanges.map((user) => {
          return (
            <Card
              key={`${user.id}-${user.exchangeId}`}
              user={user}
              cities={[]}
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
