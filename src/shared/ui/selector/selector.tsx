import { type FC, memo, useState } from "react";
import type { TSelectorProps } from "./type";
import styles from "./selector.module.scss";
import clsx from "clsx";
import { Arrow } from "@shared/ui/arrow";
import type { TOption } from "@shared/ui/options/type.ts";
import { Options } from "@shared/ui/options/options.tsx";

// Данный компонент отображает раскрывающийся список чекбоксов

export const Selector: FC<TSelectorProps> = memo(
  ({ selectionTitle, selectionOptions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<TOption[]>([]);

    const toggleOption = (option: TOption) => {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(
          selectedOptions.filter((opt: TOption) => opt !== option),
        );
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    };

    return (
      <div className={clsx(styles.wrapper)}>
        <div
          className={clsx(styles.container, {
            [styles.containerOpen]: isOpen,
          })}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectionTitle}
          <Arrow isOpen={isOpen} />
        </div>
        {
          isOpen && (
            <Options
              selectionOptions={selectionOptions}
              toggleOption={toggleOption}
              selectedOptions={selectedOptions}
            />
          )
          // (
          //   <ul className={clsx(styles.list)}>
          //     {selectionOptions.map((option) => (
          //       <li
          //         className={clsx(styles.listElement)}
          //         key={option}
          //         onClick={() => toggleOption(option)}
          //       >
          //         <input
          //           className={clsx(styles.input, {
          //             [styles.input_checked]: selectedOptions.includes(option),
          //           })}
          //           type="checkbox"
          //           checked={selectedOptions.includes(option)}
          //           readOnly
          //         />
          //         {option}
          //       </li>
          //     ))}
          //   </ul>
          // )
        }
      </div>
    );
  },
);
