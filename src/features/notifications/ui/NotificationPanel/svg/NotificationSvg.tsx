import styles from "./notificationSvg.module.scss";

export const NotificationSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    className={styles.notificationSvg}
  >
    <path
      className={styles.notificationSvgPath}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      d="M10.15 24.999a11.5 11.5 0 0 1-.983-4.657c0-6.175 4.85-11.177 10.834-11.177 5.983 0 10.833 5.004 10.833 11.177a11.5 11.5 0 0 1-.983 4.657M20 3.332v1.667m16.666 15h-1.666m-30 0H3.334m28.45-11.785-1.178 1.178m-21.21.002L8.217 8.215m15.979 23.962c1.683-.545 2.36-2.087 2.55-3.637.056-.463-.325-.848-.792-.848H14.129a.805.805 0 0 0-.813.89c.186 1.547.656 2.677 2.44 3.593m8.44.002-8.44-.002m8.44.002c-.202 3.242-1.139 4.525-4.184 4.488-3.256.06-4.006-1.528-4.256-4.49"
    />
  </svg>
);
