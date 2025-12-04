import { useEffect, useRef } from "react";
import styles from "./dropDown.module.scss";
import type { IDropDownProps } from "./dropDown.type";

export const DropDown = (props: IDropDownProps) => {
  const {
    top = "0",
    right = "0",
    bottom = "0",
    left = "0",
    children,
    onClose,
  } = props;

  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      if (!(target instanceof Element)) return;

      const isTriggerClick = target.closest("[data-trigger-dropdown]");

      if (!dropDownRef.current?.contains(target) && !isTriggerClick) {
        event.stopPropagation();
        onClose?.();
      }
    };

    const handleKeyDownClose = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDownClose);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDownClose);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.dropDownWrapper} ref={dropDownRef}>
      <div
        className={styles.dropDownContainer}
        style={{ top, right, bottom, left }}
      >
        {children}
      </div>
    </div>
  );
};

//Универсальный компонент DropDown позволяет показать контент в определенном месте на странице. Привязывается к компоненту-контроллеру (Например, кнопка открытия всплывающего меню) через атрибут data-trigger-dropdown. Закрывается по клику вне себя и вне контроллера, также по нажатию на Escape. В качестве пропсов получает top, right, bottom, left, children, onClose. Пропсы на абсолютное позиционирование на странице, children это контент внутри компонента. При клике вне компонента или по нажатию на Escape вызывает onClose.
