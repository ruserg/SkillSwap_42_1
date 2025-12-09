import { Button } from "@shared/ui/Button/Button";
import chevronRight from "@images/icons/chevron-right.svg";
import chevronUp from "@images/icons/chevron-up.svg";
import type { TViewAllButtonProps } from "./types";
import styles from "./viewAllButton.module.scss";

export const ViewAllButton = ({
  behavior = "disable",
  initialCount,
  currentCount,
  totalCount,
  onLoadMore,
  children = "Смотреть все",
  className,
}: TViewAllButtonProps) => {
  // Если элементов меньше или равно начальному количеству, кнопка не нужна
  if (totalCount <= initialCount) {
    return null;
  }

  // Для 2-way: определяем, развернуто ли сейчас
  const isExpanded = behavior === "2-way" && currentCount > initialCount;

  const handleClick = () => {
    if (behavior === "2-way") {
      if (isExpanded) {
        // Сворачиваем - возвращаем к начальному количеству
        onLoadMore(initialCount);
      } else {
        // Разворачиваем - показываем 6 элементов (3 + 3)
        const nextCount = initialCount + 3;
        onLoadMore(nextCount);
      }
    } else {
      // Для disable и hide загружаем еще 3 элемента (итого 6)
      const nextCount = initialCount + 3;
      onLoadMore(nextCount);
    }
  };

  // Для hide - скрываем кнопку после первого клика (когда показано больше начального)
  if (behavior === "hide" && currentCount > initialCount) {
    return null;
  }

  // Определяем текст кнопки
  const buttonText = isExpanded ? "Свернуть" : children;

  // Определяем иконку
  const icon = isExpanded ? chevronUp : chevronRight;

  // Определяем disabled для disable поведения (когда показано все или больше начального)
  const isDisabled = behavior === "disable" && currentCount > initialCount;

  return (
    <div className={`${styles.viewAllButtonWrapper} ${className || ""}`}>
      <Button
        variant="secondary"
        rightIcon={
          <img
            src={icon}
            alt={isExpanded ? "стрелка вверх" : "стрелка вправо"}
          />
        }
        onClick={handleClick}
        disabled={isDisabled}
      >
        {buttonText}
      </Button>
    </div>
  );
};
