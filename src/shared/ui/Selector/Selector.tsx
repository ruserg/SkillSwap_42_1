import { type FC, memo, useEffect, useState } from "react";
import type { TSelectorProps } from "@shared/ui/Selector/types";
import styles from "./selector.module.scss";
import clsx from "clsx";
import { Arrow } from "@shared/ui/Arrow/Arrow";
import type { TOption } from "@shared/ui/Options/types";
import { Options } from "@shared/ui/Options/Options";
import cross from "@shared/assets/images/icons/cross.svg";

// Данный компонент отображает раскрывающийся список чекбоксов

export const Selector: FC<TSelectorProps> = memo(
  ({
    id,
    isOpen,
    onToggle,
    selectionTitle,
    selectionPlaceholder,
    selectionOptions,
    selectorType,
    enableSearch = false,
    onChange,
    value,
  }) => {
    const [selectedOptions, setSelectedOptions] = useState<TOption[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [subTitle, setSubTitle] = useState(value || selectionPlaceholder);

    const listboxId = `selector-listbox-${id}`;
    const labelId = `selector-label-${id}`;

    useEffect(() => {
      if (selectorType === "radio") {
        setSubTitle(value || selectionPlaceholder);
        if (enableSearch) {
          setSearchValue(value || "");
        }
      }
    }, [value, selectionPlaceholder, selectorType, enableSearch]);

    const toggleOption = (option: TOption) => {
      if (selectorType === "checkbox") {
        let newSelected: TOption[] = [];
        if (selectedOptions.includes(option)) {
          newSelected = selectedOptions.filter((opt) => opt !== option);
        } else {
          newSelected = [...selectedOptions, option];
        }
        setSelectedOptions(newSelected);
        setSubTitle(
          newSelected.length ? newSelected.join(", ") : selectionPlaceholder,
        );
        onChange?.(newSelected);
      } else {
        setSelectedOptions([option]);
        if (enableSearch) setSearchValue(option);
        onChange?.(option);
        onToggle(id);
      }
    };

    const clearSearch = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSearchValue("");
      setSelectedOptions([]);
    };

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
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-labelledby={labelId}
            tabIndex={0}
            onClick={() => onToggle(id)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && isOpen) {
                onToggle(id);
              }
              if (e.key === "Enter" && !isOpen) {
                e.preventDefault();
                onToggle(id);
              }
            }}
          >
            {/* Поле ввода или просто заголовок в зависимости от значения enableSearch */}
            {enableSearch ? (
              <input
                className={styles.inputField}
                placeholder={selectionPlaceholder}
                value={searchValue}
                name={"input"}
                aria-label={selectionTitle}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onFocus={() => {
                  if (!isOpen) {
                    onToggle(id);
                  }
                }}
              />
            ) : selectorType === "radio" ? (
              value || selectionPlaceholder
            ) : (
              subTitle
            )}
            {/* Показ знака очистки строки поиска */}
            {showClear ? (
              <button
                type="button"
                className={styles.clearButton}
                onClick={clearSearch}
                aria-label="Очистить поиск"
              >
                <img src={cross} alt="иконка крестика" />
              </button>
            ) : (
              <Arrow isOpen={isOpen} />
            )}
          </div>
          {isOpen && (
            <Options
              id={listboxId}
              selectionOptions={visibleOptions}
              toggleOption={toggleOption}
              selectedOptions={selectedOptions}
              selectorType={selectorType}
              onClose={() => onToggle(id)}
            />
          )}
        </div>
      </>
    );
  },
);
