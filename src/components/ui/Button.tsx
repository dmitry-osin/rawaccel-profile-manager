import React from "react";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md";
    icon?: React.ReactNode;
}

export function Button({
                           variant = "primary",
                           size = "md",
                           icon,
                           children,
                           className = "",
                           ...props
                       }: ButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-xl " +
        "font-medium transition-colors focus:outline-none " +
        "focus:ring-2 focus:ring-[var(--md-sys-color-primary)] " +
        "disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-[var(--md-sys-color-primary)] " +
            "text-[var(--md-sys-color-on-primary)] " +
            "hover:opacity-90",
        secondary:
            "bg-[var(--md-sys-color-secondary-container)] " +
            "text-[var(--md-sys-color-on-secondary-container)] " +
            "hover:opacity-90",
        danger:
            "bg-[var(--md-sys-color-error-container)] " +
            "text-[var(--md-sys-color-on-error-container)] " +
            "hover:bg-[var(--md-sys-color-error)] " +
            "hover:text-[var(--md-sys-color-on-error)]",
        ghost:
            "bg-transparent text-[var(--md-sys-color-on-surface)] " +
            "hover:bg-[var(--md-sys-color-surface-variant)]",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon && <span className="w-4 h-4">{icon}</span>}
            {children}
        </button>
    );
}
