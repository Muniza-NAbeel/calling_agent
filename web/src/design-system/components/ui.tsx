import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
type BadgeTone = "neutral" | "signal" | "success" | "warning" | "danger";

const buttonClasses: Record<ButtonVariant, string> = {
  primary: "ds-button ds-button-primary",
  secondary: "ds-button ds-button-secondary",
  quiet: "ds-button ds-button-quiet",
  danger: "ds-button ds-button-danger",
};

const badgeClasses: Record<BadgeTone, string> = {
  neutral: "ds-badge ds-badge-neutral",
  signal: "ds-badge ds-badge-signal",
  success: "ds-badge ds-badge-success",
  warning: "ds-badge ds-badge-warning",
  danger: "ds-badge ds-badge-danger",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button className={`${buttonClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", raised = false }: {
  children: ReactNode;
  className?: string;
  raised?: boolean;
}) {
  return <div className={`${raised ? "ds-surface-raised" : "ds-surface"} ${className}`}>{children}</div>;
}

export function Badge({ children, className = "", tone = "neutral" }: {
  children: ReactNode;
  className?: string;
  tone?: BadgeTone;
}) {
  return <span className={`${badgeClasses[tone]} ${className}`}>{children}</span>;
}

export function SectionHeader({ eyebrow, title, description, action }: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="ds-section-header">
      <div>
        {eyebrow ? <p className="ds-eyebrow">{eyebrow}</p> : null}
        <h2 className="ds-section-title">{title}</h2>
        {description ? <p className="ds-section-description">{description}</p> : null}
      </div>
      {action ? <div className="ds-section-action">{action}</div> : null}
    </header>
  );
}

export function TextInput({ label, hint, error, id, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <label className="ds-field" htmlFor={id}>
      <span className="ds-field-label">{label}</span>
      <input
        id={id}
        className={`ds-input ${error ? "ds-input-error" : ""} ${className}`}
        aria-describedby={messageId}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <span className="ds-field-error" id={messageId}>{error}</span> : null}
      {!error && hint ? <span className="ds-field-hint" id={messageId}>{hint}</span> : null}
    </label>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="ds-status" role="status" aria-live="polite">
      <span className="ds-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, action }: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="ds-error-state" role="alert">
      <div>
        <p className="ds-error-title">{title}</p>
        {description ? <p className="ds-error-description">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="ds-tooltip">
      {children}
      <span className="ds-tooltip-content" role="tooltip">{label}</span>
    </span>
  );
}
