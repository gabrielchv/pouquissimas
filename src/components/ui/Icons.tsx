import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  "aria-hidden": true,
  focusable: false,
} as const;

export function BagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <path
        d="M4.5 8h15l-1.1 12.2a1.5 1.5 0 0 1-1.5 1.3H7.1a1.5 1.5 0 0 1-1.5-1.3L4.5 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M9 8V6.4a3 3 0 0 1 6 0V8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AccountIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <circle cx="12" cy="8.2" r="3.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M4.8 20.2c.5-3.8 3.4-6 7.2-6s6.7 2.2 7.2 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" {...base} {...props}>
      <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" {...base} {...props}>
      <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" {...base} {...props}>
      <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" {...base} {...props}>
      <path d="M0 7h14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 10 6" width="9" height="6" {...base} {...props}>
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 12" width="16" height="12" {...base} {...props}>
      <path
        d="M0 6h14M9 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 18" width="16" height="18" {...base} {...props}>
      <path d="M1 1l14 8-14 8V1Z" fill="currentColor" />
    </svg>
  );
}
