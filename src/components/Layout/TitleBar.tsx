import {getCurrentWebviewWindow} from "@tauri-apps/api/webviewWindow";
import {Layers, Minus, X} from "lucide-react";

export function TitleBar() {
    const appWindow = getCurrentWebviewWindow();

    const startDrag = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest("button")) {
            void appWindow.startDragging();
        }
    };

    return (
        <header
            data-tauri-drag-region
            onMouseDown={startDrag}
            className="h-10 flex items-center justify-between
            select-none bg-[var(--md-sys-color-surface-variant)]
            text-[var(--md-sys-color-on-surface)]"
        >
            <div
                data-tauri-drag-region
                className="flex items-center gap-2 px-3 h-full"
            >
                <Layers className="w-5 h-5 text-[var(--md-sys-color-primary)]"/>
                <span
                    data-tauri-drag-region
                    className="text-xs font-bold tracking-wide uppercase"
                >
          RAWACCEL PROFILE MANAGER
        </span>
            </div>

            <div className="flex items-center h-full">
                <button
                    onClick={() => appWindow.minimize()}
                    className="no-drag h-full px-4 flex items-center
                    justify-center text-[var(--md-sys-color-on-surface)]
                    hover:bg-[var(--md-sys-color-on-surface)]/20
                    active:bg-[var(--md-sys-color-on-surface)]/30
                    transition-colors"
                    aria-label="Minimize"
                >
                    <Minus className="w-4 h-4"/>
                </button>
                <button
                    onClick={() => appWindow.close()}
                    className="no-drag h-full px-4 flex items-center
                    justify-center hover:bg-[var(--md-sys-color-error)]
                    hover:text-[var(--md-sys-color-on-error)]
                    transition-colors"
                    aria-label="Close"
                >
                    <X className="w-4 h-4"/>
                </button>
            </div>
        </header>
    );
}
