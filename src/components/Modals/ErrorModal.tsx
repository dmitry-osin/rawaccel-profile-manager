import {AlertCircle} from "lucide-react";
import {Button} from "../ui/Button";

interface ErrorModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onClose: () => void;
}

export function ErrorModal({
                               isOpen,
                               title = "Error",
                               message,
                               onClose,
                           }: ErrorModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center
            justify-center
            bg-[var(--md-sys-color-scrim)]/60
            backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-2xl
                border border-[var(--md-sys-color-outline-variant)]
                bg-[var(--md-sys-color-surface)] p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="rounded-full
                    bg-[var(--md-sys-color-error-container)] p-3">
                        <AlertCircle className="w-8 h-8
                        text-[var(--md-sys-color-on-error-container)]"/>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold
                        text-[var(--md-sys-color-on-surface)]">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm
                        text-[var(--md-sys-color-on-surface-variant)]">
                            {message}
                        </p>
                    </div>

                    <Button className="w-full" onClick={onClose}>
                        OK
                    </Button>
                </div>
            </div>
        </div>
    );
}
