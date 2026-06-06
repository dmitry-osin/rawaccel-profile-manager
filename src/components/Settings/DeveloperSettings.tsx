import {Toggle} from "../ui/Toggle";

interface DeveloperSettingsProps {
    debugMode: boolean;
    logLevel: string;
    onChange: (partial: { debug_mode?: boolean; log_level?: string }) => void;
}

const logLevels = ["trace", "debug", "info", "warn", "error"];

export function DeveloperSettings({
                                      debugMode,
                                      logLevel,
                                      onChange,
                                  }: DeveloperSettingsProps) {
    return (
        <section
            className="rounded-2xl border
            border-[var(--md-sys-color-outline-variant)]
            bg-[var(--md-sys-color-surface)] p-4 shadow-sm">
            <h2 className="text-lg font-semibold
            text-[var(--md-sys-color-on-surface)]">
                Developer
            </h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                Debug and diagnostics
            </p>

            <div className="mt-4 grid gap-4">
                <Toggle
                    checked={debugMode}
                    onChange={(value) => onChange({debug_mode: value})}
                    label="Enable Debug Mode"
                />

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium
                    text-[var(--md-sys-color-on-surface-variant)]">
                        Log Level
                    </label>
                    <select
                        value={logLevel}
                        onChange={(e) => onChange({log_level: e.target.value})}
                        className="px-3 py-2 rounded-xl
                        bg-[var(--md-sys-color-surface-variant)]
                        text-[var(--md-sys-color-on-surface)]
                        border border-[var(--md-sys-color-outline-variant)]
                        focus:outline-none focus:border-[var(--md-sys-color-primary)] text-sm"
                    >
                        {logLevels.map((level) => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
}
