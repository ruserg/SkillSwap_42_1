import clsx from "clsx";
import { useRef, type FC } from "react";
import type { TOptionsProps } from "./types";
import styles from "./options.module.scss";

// Данный компонент отображает список чекбоксов

export const Options: FC<TOptionsProps> = ({
  id,
  selectionOptions,
  toggleOption,
  selectedOptions,
  selectorType,
  onClose,
}) => {
  const optionRefs = useRef<HTMLLIElement[]>([]);

  return (
    <ul id={id} role="listbox" className={clsx(styles.list)}>
      {selectionOptions.map((option, index) => (
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
          ref={(element) => {
            optionRefs.current[index] = element!;
          }}
          role="option"
          aria-selected={selectedOptions.includes(option)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              toggleOption(option);
            }
            if (e.key === "Escape") {
              e.preventDefault();
              onClose?.();
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              const nextIndex = (index + 1) % selectionOptions.length;
              optionRefs.current[nextIndex]?.focus();
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const prevIndex =
                (index - 1 + selectionOptions.length) % selectionOptions.length;
              optionRefs.current[prevIndex]?.focus();
            }
          }}
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
