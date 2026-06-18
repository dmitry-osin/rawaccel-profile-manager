import {Toggle} from "../ui/Toggle";

interface NotificationSettingsProps {
    showNotification: boolean;
    playSound: boolean;
    onChange: (partial: {
        show_notification?: boolean;
        play_sound?: boolean;
    }) => void;
}

export function NotificationSettings({
                                         showNotification,
                                         playSound,
                                         onChange,
                                     }: NotificationSettingsProps) {
    return (
        <section
            className="rounded-2xl border
            border-[var(--md-sys-color-outline-variant)]
            bg-[var(--md-sys-color-surface)]
            p-4 shadow-sm">
            <h2 className="text-lg font-semibold
            text-[var(--md-sys-color-on-surface)]">
                Notifications
            </h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                Notify when profiles switch automatically
            </p>

            <div className="mt-4 grid gap-3">
                <Toggle
                    checked={showNotification}
                    onChange={(value) => onChange({show_notification: value})}
                    label="Show notification on profile switch"
                />
                <Toggle
                    checked={playSound}
                    onChange={(value) => onChange({play_sound: value})}
                    label="Play sound on profile switch"
                />
            </div>
        </section>
    );
}
