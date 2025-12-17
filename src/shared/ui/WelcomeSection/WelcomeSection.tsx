import styles from "./welcomeSection.module.scss";
import formStyles from "@shared/ui/Form/form.module.scss";
import type { IWelcomeSectionProps } from "@shared/ui/WelcomeSection/types";

export const WelcomeSection = (props: IWelcomeSectionProps) => {
  const {
    src,
    alt,
    width = "300",
    height = "300",
    title,
    description,
    children,
  } = props;

  const getImageName = (src: string) => {
    const parts = src.split("/");
    return parts[parts.length - 1];
  };

  return (
    <section className={formStyles.welcomeContainer}>
      <div
        className={styles.lightBulb}
        style={{ width: `${width}px`, height: `${height}px` }}
        role="img"
        aria-label={alt}
        data-image-file={getImageName(src)}
      />

      <div className={formStyles.descriptionContainer}>
        {children ? (
          children
        ) : (
          <>
            {title && <h3 className={styles.welcomeTitle}>{title}</h3>}
            {description && (
              <p className={styles.welcomeDescription}>{description}</p>
            )}
          </>
        )}
      </div>
    </section>
  );
};
