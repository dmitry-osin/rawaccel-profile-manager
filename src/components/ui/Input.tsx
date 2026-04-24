import React, {forwardRef} from "react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({label, className = "", ...props}, ref) => {
        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label className="text-xs font-medium text-[var(--md-sys-color-on-surface-variant)]">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`px-3 py-2 rounded-xl bg-[var(--md-sys-color-surface-variant)] 
                    text-[var(--md-sys-color-on-surface)] 
                    border border-[var(--md-sys-color-outline-variant)] 
                    placeholder:text-[var(--md-sys-color-on-surface-variant)] 
                    focus:outline-none focus:border-[var(--md-sys-color-primary)] ${className}`}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = "Input";
