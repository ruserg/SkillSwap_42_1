import { forwardRef } from "react";
import type { ForwardedRef } from "react";
import styles from "./calendarInput.module.scss";
import { CalendarIcon } from "@shared/ui/Icons/CalendarIcon";
import type { TCalendarInputProps } from "@shared/ui/Calendar/CalendarInput/types";

export const CalendarInput = forwardRef(
  (props: TCalendarInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { className, id, onClick, ...rest } = props;

    const handleClick: React.MouseEventHandler<HTMLInputElement> = (event) => {
      onClick?.(event);
    };

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
      event,
    ) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        // Синтетически вызываем тот же клик, чтобы тип onClick соблюдался
        // и логика была одинакова для мыши и клавиатуры
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick?.(event as any);
      }
    };

    return (
      <div className={styles.container}>
        <input
          className={styles.input}
          ref={ref}
          readOnly
          id={id}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        {
          <span className={styles.icon}>
            <CalendarIcon />
          </span>
        }
      </div>
    );
  },
);
