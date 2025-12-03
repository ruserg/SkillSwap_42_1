import { forwardRef } from "react";
import type { ForwardedRef } from "react";
import styles from "./CalendarInput.module.scss";
import { CalendarIcon } from "@shared/ui/Icons/CalendarIcon.tsx";
import type { TCalendarInputProps } from "@shared/ui/Calendar/CalendarInput/type.ts";

export const CalendarInput = forwardRef(
  (props: TCalendarInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { className, ...rest } = props;

    return (
      <div className={styles.container} onClick={props.onClick}>
        <input className={styles.input} ref={ref} readOnly {...rest} />
        {
          <span className={styles.icon}>
            <CalendarIcon />
          </span>
        }
      </div>
    );
  },
);
