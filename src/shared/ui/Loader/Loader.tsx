import React from "react";
import styles from "./loader.module.scss";

interface LoaderProps {
  size?: number;
}

export const Loader: React.FC<LoaderProps> = ({ size = 80 }) => {
  return (
    <div className={styles.loaderWrapper} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="20" fill="#ABD27A" />

        {/* вращающаяся и пульсирующая звезда */}
        <g className={styles.innerStar}>
          <path
            d="M20 10C20 15.5228 24.4772 20 30 20C24.4772 20 20 24.4772 20 30C20 24.4772 15.5228 20 10 20C15.5228 20 20 15.5228 20 10Z"
            fill="#F9FAF7"
          />
        </g>
      </svg>
    </div>
  );
};
