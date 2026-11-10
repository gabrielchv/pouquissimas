"use client";

import styles from "./quantity-stepper.module.css";
import { MinusIcon, PlusIcon } from "./Icons";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Accessible name for the group, e.g. "Quantity for Crosshair Tee". */
  label: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
}: QuantityStepperProps) {
  return (
    <div className={styles.stepper} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.control}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <MinusIcon />
      </button>

      <span className={styles.value} aria-live="polite">
        {value}
      </span>

      <button
        type="button"
        className={styles.control}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <PlusIcon />
      </button>
    </div>
  );
}
