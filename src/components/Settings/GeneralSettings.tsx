import {Toggle} from "../ui/Toggle";

interface GeneralSettingsProps {
    autostart: boolean;
    startMinimized: boolean;
    closeToTray: boolean;
    minimizeToTray: boolean;
    onAutostartChange: (value: boolean) => void;
    onChange: (partial: {
        start_minimized?: boolean;
        close_to_tray?: boolean;
        minimize_to_tray?: boolean;
    }) => void;
}

export function GeneralSettings({
                                    autostart,
                                    startMinimized,
                                    closeToTray,
                                    minimizeToTray,
                                    onAutostartChange,
                                    onChange,
                                }: GeneralSettingsProps) {
    return (
        <section
            className="rounded-2xl border
            border-[var(--md-sys-color-outline-variant)]
            bg-[var(--md-sys-color-surface)]
            p-4 shadow-sm">
            <h2 className="text-lg font-semibold
            text-[var(--md-sys-color-on-surface)]">
                General
            </h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                Startup and tray behavior
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Toggle
                    checked={autostart}
                    onChange={onAutostartChange}
                    label="Start with Windows"
                />
                <Toggle
                    checked={startMinimized}
                    onChange={(value) => onChange({start_minimized: value})}
                    label="Start Minimized"
                />
                <Toggle
                    checked={closeToTray}
                    onChange={(value) => onChange({close_to_tray: value})}
                    label="Close to Tray"
                />
                <Toggle
                    checked={minimizeToTray}
                    onChange={(value) => onChange({minimize_to_tray: value})}
                    label="Minimize to Tray"
                />
            </div>
        </section>
    );
}
