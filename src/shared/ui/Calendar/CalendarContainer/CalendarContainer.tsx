import styles from "./CalendarContainer.module.scss";
import { Button } from "@shared/ui/Button";
import clsx from "clsx";
import type { TCalendarContainer } from "@shared/ui/Calendar/CalendarContainer/type.ts";

//Контейнер, в который передается календарь datepicker через соответствующий пропс.
//Служит в качестве "обертки", в которой внизу есть 2 кнопки.
export const CalendarContainer = (props: TCalendarContainer) => {
  const { children, onConfirm, onCancel, className } = props;

  return (
    <div className={clsx(className, styles.calendarContainer)}>
      {children}

      <div className={styles.calendarFooter}>
        <div className={styles.cancelButton}>
          <Button variant="secondary" onClick={onCancel}>
            Отменить
          </Button>
        </div>
        <div className={styles.confirmButton}>
          <Button onClick={onConfirm}>Выбрать</Button>
        </div>
      </div>
    </div>
  );
};
