import React from "react";
import styles from "./signupStepThree.module.scss";

interface SkeletonFieldProps {
  type?: "input" | "select" | "upload" | "image";
  count?: number;
  className?: string;
}

export const SkeletonField: React.FC<SkeletonFieldProps> = ({
  type = "input",
  count = 1,
  className = "",
}) => {
  const getSkeletonClass = () => {
    switch (type) {
      case "input":
        return styles.skeletonInput;
      case "select":
        return styles.skeletonSelect;
      case "upload":
        return styles.skeletonUploadArea;
      case "image":
        return styles.skeletonImagePreview;
      default:
        return styles.skeletonInput;
    }
  };

  if (type === "image" && count > 1) {
    return (
      <div className={styles.skeletonImagePreviews}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${styles.skeleton} ${styles.skeletonImagePreview} ${className}`}
          />
        ))}
      </div>
    );
  }

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${styles.skeleton} ${getSkeletonClass()} ${className}`}
          />
        ))}
      </>
    );
  }

  return (
    <div className={`${styles.skeleton} ${getSkeletonClass()} ${className}`} />
  );
};
