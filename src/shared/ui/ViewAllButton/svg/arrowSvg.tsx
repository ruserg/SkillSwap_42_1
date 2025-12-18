import styles from "./arrowSvg.module.scss";

export const ArrowSvg = (props: { isDirection: boolean }) => {
  const { isDirection } = props;

  const path = isDirection
    ? "M19.31 15.933a.68.68 0 0 1-.49-.203l-6.017-6.018a1.136 1.136 0 0 0-1.606 0L5.179 15.73a.696.696 0 0 1-.978 0 .696.696 0 0 1 0-.978l6.018-6.018a2.53 2.53 0 0 1 3.562 0l6.018 6.018a.696.696 0 0 1 0 .978.73.73 0 0 1-.489.203"
    : "M8.69 20a.69.69 0 0 1-.49-.203.696.696 0 0 1 0-.978l6.018-6.017a1.136 1.136 0 0 0 0-1.606L8.2 5.179a.696.696 0 0 1 0-.978.696.696 0 0 1 .978 0l6.017 6.017c.47.47.738 1.107.738 1.78 0 .675-.258 1.311-.738 1.782l-6.017 6.017a.73.73 0 0 1-.49.203";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={styles.arrowSvg}
    >
      <path className={styles.arrowSvgPath} d={path} />
    </svg>
  );
};
