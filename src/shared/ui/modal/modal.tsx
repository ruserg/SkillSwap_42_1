import type { FC } from "react";
import styles from "./modal.module.scss";
import type { TModalUIProps } from "./types";
import { ModalOverlayUI } from "../modal-overlay";

// Компонент ModalUI отображает универсальное модальное окно с затемнённым фоном.
// Принимает обязательный пропс onClose (функция закрытия модального окна).
// Дочерние элементы children позволяют полностью кастомизировать содержимое модального окна.
// При клике на оверлей вызывается функция onClose для закрытия модального окна.
export const ModalUI: FC<TModalUIProps> = ({ onClose, children }) => (
  <>
    <ModalOverlayUI onClick={onClose} />
    <div className={styles.modal} data-cy="modal">
      {children}
    </div>
  </>
);
