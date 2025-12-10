import React, { useState, useRef, useEffect } from "react";
import styles from "./signupStepThree.module.scss";
import chevronDown from "@images/icons/chevron-down.svg";
import checkboxEmpty from "@shared/assets/images/icons/checkbox-empty.svg";
import checkboxDone from "@shared/assets/images/icons/checkbox-done.svg";

interface CategorySelectorProps {
  label: string;
  options: Array<{ id: string; name: string }>;
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  label,
  options,
  selectedIds,
  onChange,
  placeholder = "Выберите...",
  disabled = false,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Обработчик клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Обработчик нажатия клавиши Escape
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const handleToggleOption = (id: string) => {
    if (disabled) return;

    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    onChange(newSelected);
  };

  const handleSelectAll = () => {
    if (disabled) return;
    const allIds = options.map((opt) => opt.id);
    onChange(allIds);
  };

  const handleClearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  const getDisplayText = () => {
    if (selectedIds.length === 0) return placeholder;

    if (selectedIds.length === 1) {
      const selectedOption = options.find((opt) => opt.id === selectedIds[0]);
      return selectedOption?.name || placeholder;
    }

    return `Выбрано: ${selectedIds.length}`;
  };

  const handleHeaderClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={styles.fieldGroup} ref={containerRef}>
      <label className={styles.label}>{label}</label>

      {isLoading ? (
        <div className={`${styles.skeleton} ${styles.skeletonSelect}`} />
      ) : (
        <div className={styles.selectorWrapper}>
          <div
            className={`${styles.selectorHeader} ${disabled ? styles.disabled : ""}`}
            onClick={handleHeaderClick}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span
              className={styles.selectorTitle}
              style={{
                color:
                  selectedIds.length === 0
                    ? "var(--color-caption)"
                    : "var(--color-text)",
              }}
            >
              {" "}
              {getDisplayText()}
            </span>
            {!disabled && (
              <img
                src={chevronDown}
                alt="chevron"
                className={`${styles.selectorChevron} ${isOpen ? styles.open : ""}`}
              />
            )}
          </div>

          <input
            type="hidden"
            name={label.toLowerCase().replace(/\s+/g, "-")}
            value={JSON.stringify(selectedIds)}
            required={selectedIds.length === 0}
          />

          {isOpen && !disabled && (
            <div className={styles.optionsList}>
              <div className={styles.dropdownActions}>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={handleSelectAll}
                >
                  Выбрать все
                </button>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={handleClearAll}
                >
                  Очистить
                </button>
              </div>

              <div className={styles.optionsScroll}>
                {options.map((option) => (
                  <div
                    key={option.id}
                    className={`${styles.optionItem} ${selectedIds.includes(option.id) ? styles.selected : ""}`}
                    onClick={() => handleToggleOption(option.id)}
                    role="option"
                    aria-selected={selectedIds.includes(option.id)}
                  >
                    <div className={styles.checkboxIcon}>
                      <img
                        src={
                          selectedIds.includes(option.id)
                            ? checkboxDone
                            : checkboxEmpty
                        }
                        alt={
                          selectedIds.includes(option.id)
                            ? "Выбрано"
                            : "Не выбрано"
                        }
                        className={styles.checkboxImage}
                      />
                    </div>
                    <span className={styles.optionText}>{option.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
