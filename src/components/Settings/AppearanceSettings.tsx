interface AppearanceSettingsProps {
    theme: "light" | "dark" | "neon";
    onChange: (theme: "light" | "dark" | "neon") => void;
}

const themes: { value: "light" | "dark" | "neon"; label: string }[] = [
    {value: "light", label: "Light"},
    {value: "dark", label: "Dark"},
    {value: "neon", label: "Neon"},
];

export function AppearanceSettings({
                                       theme,
                                       onChange,
                                   }: AppearanceSettingsProps) {
    return (
        <section
            className="rounded-2xl border
            border-[var(--md-sys-color-outline-variant)]
            bg-[var(--md-sys-color-surface)] p-4 shadow-sm">
            <h2 className="text-lg font-semibold
            text-[var(--md-sys-color-on-surface)]">
                Appearance
            </h2>
            <p className="text-sm
            text-[var(--md-sys-color-on-surface-variant)]">
                Choose the application theme
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {themes.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => onChange(t.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                            theme === t.value
                                ? "bg-[var(--md-sys-color-primary)] " +
                                "text-[var(--md-sys-color-on-primary)] border-transparent"
                                : "bg-[var(--md-sys-color-surface-variant)] " +
                                "text-[var(--md-sys-color-on-surface)] " +
                                "border-[var(--md-sys-color-outline-variant)] " +
                                "hover:bg-[var(--md-sys-color-surface)]"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
        </section>
    );
}
