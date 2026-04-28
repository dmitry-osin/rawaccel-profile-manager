import type {ReactNode} from "react";
import {AlertTriangle} from "lucide-react";
import {Button} from "../ui/Button";

interface ConfirmDeleteProps {
    isOpen: boolean;
    title?: string;
    message?: ReactNode;
    profileName?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDelete({
                                  isOpen,
                                  title,
                                  message,
                                  profileName,
                                  confirmLabel,
                                  onConfirm,
                                  onCancel,
                              }: ConfirmDeleteProps) {
    if (!isOpen) return null;

    const resolvedMessage =
        message ??
        (profileName ? (
            <>
                Are you sure you want to delete <strong>{profileName}</strong>? This
                action cannot be undone.
            </>
        ) : (
            "Are you sure? This action cannot be undone."
        ));

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
            bg-[var(--md-sys-color-scrim)]/60 backdrop-blur-sm p-4">
            <div
                className="w-full max-w-sm rounded-2xl border
                border-[var(--md-sys-color-outline-variant)]
                bg-[var(--md-sys-color-surface)] p-6 shadow-lg">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="rounded-full
                    bg-[var(--md-sys-color-error-container)] p-3">
                        <AlertTriangle className="w-8 h-8
                        text-[var(--md-sys-color-on-error-container)]"/>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-[var(--md-sys-color-on-surface)]">
                            {title ?? "Delete Profile?"}
                        </h2>
                        <p className="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                            {resolvedMessage}
                        </p>
                    </div>

                    <div className="flex w-full gap-3">
                        <Button variant="secondary" className="flex-1" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button variant="danger" className="flex-1" onClick={onConfirm}>
                            {confirmLabel ?? "Delete"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
