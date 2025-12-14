import React, { useMemo } from "react";
import { Card } from "@shared/ui/Card/Card";
import { CardSkeleton } from "@shared/ui/CardSkeleton/CardSkeleton";
import type { UserWithLikes } from "@entities/user/types";
import type { TCity } from "@entities/city/types";
import styles from "./userCardsList.module.scss";

interface UserCardsListProps {
  users: UserWithLikes[];
  cities: TCity[];
  isLoading?: boolean;
  emptyMessage?: string;
  onUserClick?: (user: UserWithLikes) => void;
}

export const UserCardsList: React.FC<UserCardsListProps> = ({
  users,
  cities,
  isLoading = false,
  emptyMessage = "Нет пользователей для отображения",
  onUserClick,
}) => {
  const content = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <CardSkeleton key={index} />
      ));
    }

    if (users.length === 0) {
      return <div className={styles.noResults}>{emptyMessage}</div>;
    }

    return users.map((user) => (
      <Card
        key={user.id}
        user={user}
        cities={cities}
        onDetailsClick={() => onUserClick?.(user)}
        isLoading={false}
      />
    ));
  }, [isLoading, users, cities, emptyMessage, onUserClick]);

  return <>{content}</>;
};

UserCardsList.displayName = "UserCardsList";
