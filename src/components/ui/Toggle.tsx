export interface ToggleProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    label?: string;
}

export function Toggle({checked, onChange, label}: ToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="inline-flex items-center gap-3"
        >
      <span
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              checked
                  ? "bg-[var(--md-sys-color-primary)]"
                  : "bg-[var(--md-sys-color-outline)]"
          }`}
      >
        <span
            className={`inline-block h-4 w-4 rounded-full bg-[var(--md-sys-color-on-primary)] transition-transform ${
                checked ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </span>
            {label && (
                <span className="text-sm text-[var(--md-sys-color-on-surface)]">
          {label}
        </span>
            )}
        </button>
    );
}
