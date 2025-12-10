import { forwardRef } from "react";
import type { ForwardedRef } from "react";
import styles from "./calendarInput.module.scss";
import { CalendarIcon } from "@shared/ui/Icons/CalendarIcon";
import type { TCalendarInputProps } from "@shared/ui/Calendar/CalendarInput/types";

export const CalendarInput = forwardRef(
  (props: TCalendarInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { className, id, ...rest } = props;

    return (
      <div className={styles.container} onClick={props.onClick}>
        <input className={styles.input} ref={ref} readOnly id={id} {...rest} />
        {
          <span className={styles.icon}>
            <CalendarIcon />
          </span>
        }
      </div>
    );
  },
);
