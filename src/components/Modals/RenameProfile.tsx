import {useEffect, useRef, useState} from "react";
import {Button} from "../ui/Button";
import {Input} from "../ui/Input";

interface RenameProfileProps {
    isOpen: boolean;
    currentName: string;
    onSave: (name: string) => void;
    onCancel: () => void;
}

export function RenameProfile({
                                  isOpen,
                                  currentName,
                                  onSave,
                                  onCancel,
                              }: RenameProfileProps) {
    const [name, setName] = useState(currentName);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setName(currentName);
            requestAnimationFrame(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            });
        }
    }, [isOpen, currentName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed) {
            onSave(trimmed);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center
            justify-center bg-[var(--md-sys-color-scrim)]/60
            backdrop-blur-sm p-4">
            <div
                className="w-full max-w-sm rounded-2xl
                border border-[var(--md-sys-color-outline-variant)]
                bg-[var(--md-sys-color-surface)] p-6 shadow-lg">
                <h2 className="text-lg font-semibold
                text-[var(--md-sys-color-on-surface)]">
                    Rename Profile
                </h2>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                    <Input
                        ref={inputRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Profile name"
                        label="Name"
                    />

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={!name.trim()}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
