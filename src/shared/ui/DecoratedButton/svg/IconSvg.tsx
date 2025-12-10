import styles from "./iconSvg.module.scss";

export const Like = ({ isUser }: { isUser?: boolean }) => {
  const classEmpty = isUser ? styles.svgNonUser : styles.svgMainPath;
  const pathEmpty = isUser
    ? "M7.5 3A5.5 5.5 0 0 0 2 8.5C2 14 8.5 19 12 20.163 15.5 19 22 14 22 8.5a5.5 5.5 0 0 0-10-3.163A5.5 5.5 0 0 0 7.5 3"
    : "M12 20.954c-.288 0-.567-.038-.8-.121C7.647 19.614 2 15.288 2 8.898 2 5.642 4.633 3 7.87 3A5.78 5.78 0 0 1 12 4.712 5.78 5.78 0 0 1 16.13 3C19.367 3 22 5.651 22 8.898c0 6.4-5.646 10.716-9.2 11.935-.233.083-.512.12-.8.12M7.87 4.394c-2.465 0-4.475 2.019-4.475 4.503 0 6.353 6.112 9.888 8.26 10.623.168.056.531.056.699 0 2.139-.735 8.26-4.26 8.26-10.623 0-2.484-2.01-4.503-4.474-4.503A4.42 4.42 0 0 0 12.567 6.2c-.26.353-.855.353-1.116 0A4.44 4.44 0 0 0 7.87 4.395";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={styles.svg}
    >
      <path className={classEmpty} d={pathEmpty} />
    </svg>
  );
};

export const LikePaint = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={styles.svg}
  >
    <path
      className={styles.svgFill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7.5 3A5.5 5.5 0 0 0 2 8.5C2 14 8.5 19 12 20.163 15.5 19 22 14 22 8.5a5.5 5.5 0 0 0-10-3.163A5.5 5.5 0 0 0 7.5 3"
    />
  </svg>
);

export const Moon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={styles.svg}
  >
    <path
      className={styles.svgMainPath}
      d="M12.426 22c-.159 0-.317 0-.475-.01-5.209-.232-9.562-4.427-9.925-9.543C1.71 8.057 4.25 3.955 8.342 2.234c1.163-.483 1.777-.111 2.037.159.26.26.623.865.14 1.971a7.6 7.6 0 0 0-.633 3.116c.019 4.121 3.442 7.618 7.618 7.786.605.028 1.2-.019 1.777-.121 1.227-.223 1.739.27 1.934.586.196.316.419.995-.325 2C18.918 20.428 15.783 22 12.425 22m-9.014-9.655c.317 4.428 4.093 8.055 8.595 8.25a9.05 9.05 0 0 0 7.748-3.683 1.9 1.9 0 0 0 .233-.41 1.5 1.5 0 0 0-.465.029 9.7 9.7 0 0 1-2.084.14c-4.911-.196-8.93-4.317-8.957-9.172 0-1.284.25-2.52.762-3.683.093-.205.112-.344.121-.419-.083 0-.232.019-.474.121-3.544 1.488-5.739 5.041-5.479 8.827"
    />
  </svg>
);

export const Bell = ({ isFill }: { isFill?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={styles.svg}
  >
    <path
      className={styles.svgMainStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M3.527 14.493c-.192 1.255.664 2.125 1.712 2.559 4.016 1.665 9.606 1.665 13.622 0 1.048-.434 1.904-1.305 1.712-2.559-.117-.771-.7-1.413-1.13-2.04-.565-.832-.62-1.738-.621-2.703 0-3.728-3.03-6.75-6.772-6.75-3.741 0-6.773 3.022-6.773 6.75 0 .965-.055 1.872-.62 2.703-.43.627-1.012 1.269-1.13 2.04"
    />
    <path
      className={styles.svgMainStroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M8.45 18.3c.412 1.552 1.869 2.7 3.6 2.7 1.733 0 3.187-1.148 3.6-2.7"
    />
    {isFill && <circle cx="18" cy="6" r="6" className={styles.svgCircle} />}
  </svg>
);

export const Share = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={styles.svg}
  >
    <path
      className={styles.svgMainPath}
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M17.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm-11 6.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
    />
    <path
      className={styles.svgMainPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m15 6.788-6.33 3.835m0 2.659 6.67 3.942"
    />
    <path
      className={styles.svgMainPath}
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M17.5 16a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
    />
  </svg>
);

export const Parametrs = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={styles.svg}
  >
    <path
      className={styles.svgMainPath}
      d="M14.79 22H9.21C4.157 22 2 19.842 2 14.79V9.21C2 4.157 4.158 2 9.21 2h5.58C19.843 2 22 4.158 22 9.21v5.58c0 5.052-2.158 7.21-7.21 7.21M9.21 3.395c-4.29 0-5.815 1.526-5.815 5.814v5.582c0 4.288 1.526 5.814 5.814 5.814h5.582c4.288 0 5.814-1.526 5.814-5.814V9.209c0-4.288-1.526-5.814-5.814-5.814z"
    />
    <path
      className={styles.svgMainPath}
      d="M12 12.93a.927.927 0 0 1-.93-.93c0-.512.418-.93.93-.93s.93.418.93.93-.409.93-.93.93M15.72 12.93a.927.927 0 0 1-.93-.93c0-.512.42-.93.93-.93.512 0 .931.418.931.93s-.41.93-.93.93M8.279 12.93a.927.927 0 0 1-.93-.93c0-.512.418-.93.93-.93.511 0 .93.418.93.93s-.41.93-.93.93"
    />
  </svg>
);
