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

  const currentSvg = (variant: string) => {
    switch (variant) {
      case "heart":
        return (
          <Like isUser={isUser} aria-label="Пустой лайк" aria-hidden={true} />
        );
      case "heartFill":
        return <LikePaint aria-label="Поставленный лайк" aria-hidden={true} />;
      case "moon":
        return <Moon aria-label="Смена темы" aria-hidden={true} />;
      case "bell":
        return (
          <Bell
            aria-label="Уведомления"
            isFill={!!notificationsCount}
            aria-hidden={true}
          />
        );
      case "share":
        return <Share aria-label="Поделиться" aria-hidden={true} />;
      case "parameters":
        return (
          <Parametrs aria-label="Дополнительные параметры" aria-hidden={true} />
        );
    }
  };

  return (
    <button
      onClick={onClick}
      className={styles.decorationButton}
      disabled={disabled}
      type={htmlType}
    >
      {currentSvg(variant)}
    </button>
  );
};
