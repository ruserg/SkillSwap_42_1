import styles from "./arrowButtonSvg.module.scss";

export const Chevron = ({
  isOpen,
  color = "black",
}: {
  isOpen: boolean;
  color: "green" | "black";
}) => {
  const direction = isOpen
    ? "M19.31 15.933a.68.68 0 0 1-.49-.203l-6.017-6.018a1.136 1.136 0 0 0-1.606 0L5.179 15.73a.696.696 0 0 1-.978 0 .696.696 0 0 1 0-.978l6.018-6.018a2.53 2.53 0 0 1 3.562 0l6.018 6.018a.696.696 0 0 1 0 .978.73.73 0 0 1-.489.203"
    : "M12 15.935c-.646 0-1.292-.249-1.781-.738L4.2 9.179a.696.696 0 0 1 0-.978.696.696 0 0 1 .978 0l6.018 6.018a1.136 1.136 0 0 0 1.606 0L18.821 8.2a.696.696 0 0 1 .978 0 .696.696 0 0 1 0 .978l-6.018 6.018c-.489.49-1.135.738-1.781.738";

  const classPath =
    color === "green" ? styles.chevronGreen : styles.chevronBlack;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={styles.chevron}
    >
      <path className={classPath} d={direction} />
    </svg>
  );
};
