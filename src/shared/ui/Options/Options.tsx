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
          className={clsx(
            selectorType === "checkbox"
              ? styles.listElementCheckbox
              : styles.listElementRadio,
            selectorType === "radio" &&
              selectedOptions.includes(option) &&
              styles.inputRadioChecked,
          )}
          key={option}
          onClick={() => toggleOption(option)}
        >
          <input
            className={clsx(
              selectorType === "checkbox"
                ? selectedOptions.includes(option)
                  ? styles.inputCheckboxChecked
                  : styles.inputCheckbox
                : styles.inputRadio,
            )}
            type={selectorType === "checkbox" ? "checkbox" : "radio"}
            checked={selectedOptions.includes(option)}
            readOnly
          />
          {option}
        </li>
      ))}
    </ul>
  );
};
