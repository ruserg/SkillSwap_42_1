import styles from "./modalOverlay.module.scss";

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div className={styles.overlay} onClick={onClick} />
);
