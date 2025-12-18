import styles from "./styles/checkboxSvg.module.scss";

export const CheckboxEmpty = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    className={styles.checkboxEmpty}
  >
    <path
      className={styles.checkboxEmptyPath}
      d="M7.209.5h5.582c2.468 0 4.11.53 5.145 1.564S19.5 4.741 19.5 7.21v5.582c0 2.468-.53 4.11-1.564 5.145S15.259 19.5 12.79 19.5H7.209c-2.468 0-4.11-.53-5.145-1.564S.5 15.259.5 12.79V7.209c0-2.468.53-4.11 1.564-5.145S4.741.5 7.21.5Zm0 .396c-2.18 0-3.805.382-4.868 1.445S.896 5.03.896 7.209v5.582c0 2.18.382 3.805 1.445 4.868s2.689 1.446 4.868 1.446h5.582c2.18 0 3.805-.383 4.868-1.446s1.446-2.689 1.446-4.868V7.209c0-2.18-.383-3.805-1.446-4.868S14.97.896 12.791.896z"
    />
  </svg>
);

export const CheckboxActive = (props: { isOpenList: boolean }) => {
  const { isOpenList } = props;

  const pathD = isOpenList
    ? "M12.791 0C17.841 0 20 2.158 20 7.209v5.582C20 17.841 17.842 20 12.791 20H7.209C2.159 20 0 17.842 0 12.791V7.209C0 2.159 2.158 0 7.209 0zm1.99 6.63a.755.755 0 0 0-1.061 0l-5.14 5.14-2.3-2.3a.755.755 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.83 2.83a.75.75 0 0 0 1.06 0l5.67-5.67c.29-.29.29-.77 0-1.06"
    : "M12.791 0C17.841 0 20 2.158 20 7.209v5.582C20 17.841 17.842 20 12.791 20H7.209C2.159 20 0 17.842 0 12.791V7.209C0 2.159 2.158 0 7.209 0zM6 9.25c-.41 0-.75.34-.75.75s.34.75.75.75h8c.41 0 .75-.34.75-.75s-.34-.75-.75-.75z";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={styles.checkboxActive}
    >
      <path className={styles.checkboxActivePath} d={pathD} />
    </svg>
  );
};
