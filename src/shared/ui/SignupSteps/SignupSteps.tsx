import type { TRegisterStepsProps } from "./types";
import styles from "./signupSteps.module.scss";
import clsx from "clsx";

export const SignupSteps = (props: TRegisterStepsProps) => {
  const { currentStep, totalSteps = 3 } = props;

  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={styles.container}>
      <h1>{`Шаг ${currentStep} из ${totalSteps}`}</h1>
      <div className={styles.stepsContainer}>
        {steps.map((step) => (
          <div
            key={step}
            className={clsx(
              styles.step,
              step <= currentStep && styles.stepActive,
            )}
          />
        ))}
      </div>
    </div>
  );
};
