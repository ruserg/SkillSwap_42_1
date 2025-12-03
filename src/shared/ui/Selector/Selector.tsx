import { type FC, memo, useState } from "react";
import type { TSelectorProps } from "./type";
import styles from "./selector.module.scss";
import clsx from "clsx";
import { Arrow } from "../arrow/arrow";
import type { TOption } from "../options/type";
import { Options } from "../options/options";
import cross from "../../../images/icons/cross.svg";

// Данный компонент отображает раскрывающийся список чекбоксов

export const Selector: FC<TSelectorProps> = memo(
  ({
    selectionTitle,
    selectionPlaceholder,
    selectionOptions,
    selectorType,
    enableSearch = false,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<TOption[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [subTitle, setSubTitle] = useState(selectionPlaceholder);

    const toggleOption = (option: TOption) => {
      let newSelected: TOption[] = [];

      if (selectorType === "checkbox") {
        if (selectedOptions.includes(option)) {
          setSelectedOptions(
            selectedOptions.filter((opt: TOption) => opt !== option),
          );
          newSelected = selectedOptions.filter((opt) => opt !== option);
        } else {
          setSelectedOptions([...selectedOptions, option]);
          newSelected = [...selectedOptions, option];
        }
      } else {
        setSelectedOptions([option]);
        newSelected = [option];
        if (enableSearch) {
          setSearchValue(option);
          setIsOpen(false);
        }
      }

      // Обновление subTitle
      if (selectorType === "checkbox") {
        setSubTitle(
          newSelected.length ? newSelected.join(", ") : selectionPlaceholder,
        );
      } else {
        setSubTitle(newSelected[0] || selectionPlaceholder);
      }
    };

    // Очистка строки поиска
    const clearSearch = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSearchValue("");
      setSelectedOptions([]);
      setIsOpen(true);
    };

    // Показ знака очистки строки поиска
    const showClear = enableSearch && searchValue.length > 0 && isOpen;

    // Фильтрация списка при включённом поиске
    const visibleOptions = enableSearch
      ? selectionOptions.filter((option) =>
          option.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : selectionOptions;

    return (
      <>
        <span>{selectionTitle}</span>
        <div className={clsx(styles.wrapper, { [styles.wrapperOpen]: isOpen })}>
          <div
            className={clsx(styles.container, {
              [styles.containerOpen]: isOpen,
            })}
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Поле ввода или просто заголовок в зависимости от значения enableSearch */}
            {enableSearch ? (
              <input
                className={styles.inputField}
                placeholder={selectionPlaceholder}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  // setIsOpen(true);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // setIsOpen(true);
                }}
              />
            ) : (
              subTitle
            )}
            {/* Показ знака очистки строки поиска */}
            {showClear ? (
              <span onClick={clearSearch}>
                <img src={cross} alt="иконка крестика" />
              </span>
            ) : (
              <Arrow isOpen={isOpen} />
            )}
          </div>
          {isOpen && (
            <Options
              selectionOptions={visibleOptions}
              toggleOption={toggleOption}
              selectedOptions={selectedOptions}
              selectorType={selectorType}
            />
          )}
        </div>
      </>
    );
  },
);
