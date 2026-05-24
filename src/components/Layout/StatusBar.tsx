import {getCurrentWebviewWindow} from "@tauri-apps/api/webviewWindow";
import {useStore} from "../../store/useStore";

export function StatusBar() {
    const appWindow = getCurrentWebviewWindow();
    const profiles = useStore((state) => state.profiles);
    const activeProfileId = useStore((state) => state.activeProfileId);
    const autoSwitchEnabled = useStore(
        (state) => state.settings?.auto_switch_enabled ?? false
    );

    const activeProfile = profiles.find((p) => p.id === activeProfileId);
    const activeProfileName = activeProfile?.name ?? "—";

    return (
        <footer
            data-tauri-drag-region
            onMouseDown={() => void appWindow.startDragging()}
            className="h-8 flex items-center justify-between
            px-3 text-xs bg-[var(--md-sys-color-surface-variant)]
            text-[var(--md-sys-color-on-surface-variant)]
            border-t border-[var(--md-sys-color-outline-variant)]"
        >
            <span>v1.0.0</span>
            <span>
        Active: <span className="text-[var(--md-sys-color-on-surface)]">{activeProfileName}</span>
      </span>
            <span className="flex items-center gap-1.5">
        <span
            className={`w-2 h-2 rounded-full ${
                autoSwitchEnabled ? "bg-green-500" : "bg-gray-500"
            }`}
        />
                {autoSwitchEnabled ? "Auto-Switch ON" : "Auto-Switch OFF"}
      </span>
        </footer>
    );
}
