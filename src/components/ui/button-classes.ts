import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export function buttonClassName(
  variant: ButtonVariant = "primary",
  extra?: string,
): string {
  return [styles.button, styles[variant], extra].filter(Boolean).join(" ");
}
