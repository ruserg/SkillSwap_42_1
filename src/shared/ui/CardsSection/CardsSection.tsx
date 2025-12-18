import React from "react";
import type { ReactNode } from "react";
import { ViewAllButton } from "@shared/ui/ViewAllButton/ViewAllButton";
import type { TViewAllButtonProps } from "@shared/ui/ViewAllButton/types";
import styles from "./cardsSection.module.scss";

interface CardsSectionProps {
  title?: string;
  children: ReactNode;
  showViewAll?: boolean;
  viewAllProps?: {
    behavior?: TViewAllButtonProps["behavior"];
    initialCount: number;
    currentCount: number;
    totalCount: number;
    onLoadMore: (count: number) => void;
    children?: string;
    className?: string;
  };
  className?: string;
  headerContent?: ReactNode;
  sentinelRef?: React.RefObject<HTMLDivElement | null>;
}

export const CardsSection: React.FC<CardsSectionProps> = ({
  title,
  children,
  showViewAll = false,
  viewAllProps,
  className = "",
  headerContent,
  sentinelRef,
}) => {
  const handleLoadMore = () => {
    if (viewAllProps?.onLoadMore) {
      const nextCount = Math.min(
        viewAllProps.currentCount + 3,
        viewAllProps.totalCount,
      );
      viewAllProps.onLoadMore(nextCount);
    }
  };

  return (
    <section className={`${styles.section} ${className}`}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleRow}>
          {title && <h2 className={styles.sectionTitle}>{title}</h2>}
          {showViewAll && viewAllProps && (
            <ViewAllButton
              behavior={viewAllProps.behavior}
              initialCount={viewAllProps.initialCount}
              currentCount={viewAllProps.currentCount}
              totalCount={viewAllProps.totalCount}
              onLoadMore={handleLoadMore}
              children={viewAllProps.children}
              className={viewAllProps.className}
            />
          )}
        </div>
        {headerContent}
      </div>
      <div className={styles.cardsGrid}>
        {children}
        {sentinelRef && (
          <div
            ref={sentinelRef as React.RefObject<HTMLDivElement>}
            className={styles.sentinel}
          />
        )}
      </div>
    </section>
  );
};

CardsSection.displayName = "CardsSection";
