import { lazy, useRef, type FC } from "react";
import styles from "./modal.module.scss";
import type { TModalUIProps } from "./types";
import { ModalOverlayUI } from "@shared/ui/ModalOverlay/ModalOverlay";
const FocusTrap = lazy(() => import("focus-trap-react"));

// Компонент ModalUI отображает универсальное модальное окно с затемнённым фоном.
// Принимает обязательный пропс onClose (функция закрытия модального окна).
// Дочерние элементы children позволяют полностью кастомизировать содержимое модального окна.
// При клике на оверлей вызывается функция onClose для закрытия модального окна.

export const ModalUI: FC<TModalUIProps> = ({
  onClose,
  children,
  titleId,
  descriptionId,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const getInitialFocus = () => {
    if (!modalRef.current) return false;

    const selector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const elements = modalRef.current.querySelectorAll<HTMLElement>(selector);

    return elements[0] || false;
  };

  return (
    <>
      <ModalOverlayUI onClick={onClose} />
      <FocusTrap
        focusTrapOptions={{
          initialFocus: getInitialFocus,
          returnFocusOnDeactivate: true,
          escapeDeactivates: false,
          clickOutsideDeactivates: false,
        }}
      >
        <div
          className={styles.modal}
          data-cy="modal"
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          {children}
        </div>
      </FocusTrap>
    </>
  );
};
