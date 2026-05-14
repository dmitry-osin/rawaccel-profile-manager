import {Loader} from "lucide-react";
import {Button} from "../ui/Button";

interface BlockerOverlayProps {
    onCancel: () => void;
}

export function BlockerOverlay({onCancel}: BlockerOverlayProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
            bg-[var(--md-sys-color-scrim)]/60
            backdrop-blur-sm">
            <div
                className="flex flex-col items-center gap-4 p-8 rounded-2xl
                bg-[var(--md-sys-color-surface)]
                text-[var(--md-sys-color-on-surface)]
                border border-[var(--md-sys-color-outline-variant)] shadow-lg">
                <Loader className="w-10 h-10 animate-spin
                text-[var(--md-sys-color-primary)]"/>
                <p className="text-center max-w-sm">
                    RawAccel is open. Configure your profile and close the window to
                    continue.
                </p>
                <Button variant="secondary" onClick={onCancel}>
                    Cancel Operation
                </Button>
            </div>
        </div>
    );
}
