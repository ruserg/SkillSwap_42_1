import clsx from "clsx";
import type { FC } from "react";
import type { TOptionsProps } from "./types";
import styles from "./options.module.scss";

// Данный компонент отображает список чекбоксов

export const Options: FC<TOptionsProps> = ({
  id,
  selectionOptions,
  toggleOption,
  selectedOptions,
  selectorType,
}) => {
  return (
    <ul id={id} role="listbox" className={clsx(styles.list)}>
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
          role="option"
          aria-selected={selectedOptions.includes(option)}
          onClick={() => toggleOption(option)}
        >
          <input
            aria-hidden="true"
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
