import styles from "./decoratedButton.module.scss";
import type { TDecorButtonProps } from "@shared/ui/DecoratedButton/types";
import { Bell, Like, LikePaint, Moon, Parametrs, Share } from "./svg/IconSvg";

export const DecoratedButton = (props: TDecorButtonProps) => {
  const {
    variant = "heart",
    disabled = false,
    onClick,
    notificationsCount,
    htmlType = "button",
    isUser,
  } = props;

  const ariaLabels = {
    heart: "Добавить в избранное",
    heartFill: "Убрать из избранного",
    moon: "Сменить тему",
    bell: notificationsCount
      ? `Уведомления (${notificationsCount} новых)`
      : "Уведомления",
    share: "Поделиться",
    parameters: "Дополнительные параметры",
  };

  const currentSvg = (variant: string) => {
    switch (variant) {
      case "heart":
        return <Like isUser={isUser} />;
      case "heartFill":
        return <LikePaint />;
      case "moon":
        return <Moon />;
      case "bell":
        return <Bell isFill={!!notificationsCount} />;
      case "share":
        return <Share />;
      case "parameters":
        return <Parametrs />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={styles.decorationButton}
      disabled={disabled}
      type={htmlType}
      aria-label={ariaLabels[variant]}
    >
      {currentSvg(variant)}
    </button>
  );
};
