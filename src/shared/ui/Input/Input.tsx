import type { InputProps } from "./input.types";
import styles from "./input.module.scss";
import { useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import { RadioActive, RadioEmpty } from "./InputSvg/RadioSvg";
import { CheckboxActive, CheckboxEmpty } from "./InputSvg/CheckboxSvg";
import { SearchSvg } from "./InputSvg/searchSvg";
import { CalendateSvg } from "./InputSvg/calendareSvg";
import { HidePassword, ShowPassword } from "./InputSvg/passwordSvg";

export const Input = (props: InputProps) => {
  const {
    type,
    children,
    isOpenList = false,
    isShowPassword = false,
    isBlockCheckedLabel = false,
    openListFunction,
    ...restProps
  } = props;

  if (type === "radio" || type === "checkbox") {
    const inputClass =
      type === "radio" ? styles.inputRadio : styles.inputCheckbox;

    const labelClass =
      type === "radio" ? styles.labelRadio : styles.labelCheckbox;

    const checkedSvg =
      type === "radio" ? (
        props.checked ? (
          <RadioActive />
        ) : (
          <RadioEmpty />
        )
      ) : props.checked ? (
        <CheckboxActive isOpenList={isOpenList} />
      ) : (
        <CheckboxEmpty />
      );

    const blockChecked = (e: MouseEvent<HTMLSpanElement>) => {
      if (isBlockCheckedLabel) {
        e.preventDefault();
        openListFunction?.();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
      if (type === "radio" && props.name) {
        // Для радиокнопок: стрелки для навигации внутри группы
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          const radioButtons = document.querySelectorAll<HTMLInputElement>(
            `input[type="radio"][name="${props.name}"]`,
          );
          const currentIndex = Array.from(radioButtons).findIndex(
            (btn) => btn === e.currentTarget.querySelector("input"),
          );
          const nextIndex = (currentIndex + 1) % radioButtons.length;
          radioButtons[nextIndex]?.focus();
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          const radioButtons = document.querySelectorAll<HTMLInputElement>(
            `input[type="radio"][name="${props.name}"]`,
          );
          const currentIndex = Array.from(radioButtons).findIndex(
            (btn) => btn === e.currentTarget.querySelector("input"),
          );
          const prevIndex =
            (currentIndex - 1 + radioButtons.length) % radioButtons.length;
          radioButtons[prevIndex]?.focus();
        }
      }
    };

    return (
      <label
        className={labelClass}
        onKeyDown={type === "radio" ? handleKeyDown : undefined}
      >
        <input
          className={`${inputClass} ${styles.visuallyHidden}`}
          type={type}
          {...restProps}
        />
        {checkedSvg}
        <span
          className={styles.inputText}
          onClick={blockChecked}
          role={isBlockCheckedLabel ? "button" : undefined}
          aria-disabled={isBlockCheckedLabel}
        >
          {children}
        </span>
      </label>
    );
  }

  if (type === "search") {
    return (
      <label className={styles.inputSearchWrapper}>
        <input
          className={styles.inputSearch}
          type="search"
          placeholder={props.placeholder || "Искать навык"}
          aria-label={props["aria-label"] || "Поиск"}
          {...restProps}
        />
        <SearchSvg className={styles.inputSearchSvg} aria-hidden="true" />
      </label>
    );
  }

  if (type === "date") {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handlePlaceHolderColor = (event: ChangeEvent<HTMLInputElement>) => {
      event.target.value
        ? event.target.classList.remove(styles.datePlaceholder)
        : event.target.classList.add(styles.datePlaceholder);

      if (inputRef.current?.blur) setIsCalendarOpen(false);
    };

    const handleCalendarToggle = () => {
      if (inputRef.current === null) return;

      if (isCalendarOpen) {
        setIsCalendarOpen(false);
      } else {
        inputRef.current.showPicker();
        setIsCalendarOpen(true);
      }
    };

    return (
      <div className={styles.inputDateWrapper}>
        <input
          ref={inputRef}
          className={`${styles.input} ${styles.datePlaceholder}`}
          onChange={handlePlaceHolderColor}
          type={type}
          aria-label={props["aria-label"] || "Выберите дату"}
          {...restProps}
        />
        <button
          type="button"
          className={styles.buttonDate}
          onClick={handleCalendarToggle}
          aria-label="Открыть календарь"
          aria-expanded={isCalendarOpen}
        >
          <CalendateSvg aria-hidden="true" />
        </button>
      </div>
    );
  }

  if (type === "password") {
    const [showPassword, setShowPassword] = useState(isShowPassword);
    const [hasValue, setHasValue] = useState(false);

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleHasValue = (event: ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(event.target.value));
    };

    return (
      <div className={styles.inputPasswordWrapper}>
        <input
          className={styles.inputPassword}
          type={showPassword ? "text" : "password"}
          onChange={handleHasValue}
          aria-label={props["aria-label"] || "Введите пароль"}
          {...restProps}
        />
        {hasValue && (
          <button
            type="button"
            className={styles.showPassword}
            onClick={handleShowPassword}
            aria-label={showPassword ? "Показать пароль" : "Скрыть пароль"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <HidePassword aria-hidden="true" />
            ) : (
              <ShowPassword aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <input
      className={styles.input}
      type={type}
      aria-label={props["aria-label"] ?? props.placeholder ?? "Поле ввода"}
      {...restProps}
    />
  );
};
