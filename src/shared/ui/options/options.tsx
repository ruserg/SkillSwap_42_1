import clsx from "clsx";
import type { FC } from "react";
import type { TOptionsProps } from "./type";
import styles from "./options.module.scss";

// Данный компонент отображает список чекбоксов

export const Options: FC<TOptionsProps> = ({
  selectionOptions,
  toggleOption,
  selectedOptions,
}) => {
  return (
    <ul className={clsx(styles.list)}>
      {selectionOptions.map((option) => (
        <li
          className={clsx(styles.listElement)}
          key={option}
          onClick={() => toggleOption(option)}
        >
          <input
            className={clsx(styles.input, {
              [styles.inputChecked]: selectedOptions.includes(option),
            })}
            type="checkbox"
            checked={selectedOptions.includes(option)}
            readOnly
          />
          {option}
        </li>
      ))}
    </ul>
  );
};
