import styles from "./welcomeSection.module.scss";
import type { IWelcomeSectionProps } from "@shared/ui/WelcomeSection/types";

export const WelcomeSection = (props: IWelcomeSectionProps) => {
  const { src, alt, width = "300", height = "300", title, description } = props;
  return (
    <section className={styles.welcomeContainer}>
      <img
        className={styles.lightBulb}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={"lazy"}
      />
      <div className={styles.descriptionContainer}>
        <h3 className={styles.welcomeTitle}>{title}</h3>
        <p className={styles.welcomeDescription}>{description}</p>
      </div>
    </section>
  );
};
