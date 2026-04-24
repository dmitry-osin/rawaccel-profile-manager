import {useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import {open} from "@tauri-apps/plugin-dialog";
import {FolderOpen} from "lucide-react";
import {Button} from "../../ui/Button";
import {Input} from "../../ui/Input";

interface PathStepProps {
    path: string;
    onPathChange: (path: string, valid: boolean) => void;
}

export function PathStep({path, onPathChange}: PathStepProps) {
    const [error, setError] = useState<string | null>(null);
    const [validating, setValidating] = useState(false);

    const handleSelect = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            title: "Select RawAccel Folder",
        });

        if (typeof selected !== "string") {
            return;
        }

        setValidating(true);
        setError(null);

        const formatError = (err: unknown): string => {
            if (err instanceof Error) return err.message;
            if (typeof err === "string") return err;

            if (typeof err === "object" && err !== null) {
                const obj = err as Record<string, unknown>;

                if (typeof obj.message === "string") {
                    return obj.message;
                }

                const stringValues = Object.values(obj).filter(
                    (value): value is string => typeof value === "string"
                );
                if (stringValues.length > 0) {
                    return stringValues.join(": ");
                }
            }

            return String(err);
        };

        try {
            await invoke("set_rawaccel_path", {path: selected});
            onPathChange(selected, true);
        } catch (err) {
            setError(formatError(err));
            onPathChange(selected, false);
        } finally {
            setValidating(false);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-[var(--md-sys-color-on-surface)]">
                RawAccel Directory
            </h2>
            <p className="text-center text-[var(--md-sys-color-on-surface-variant)]">
                Select the folder containing rawaccel.exe, writer.exe and installer.exe.
            </p>

            <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                    <Input
                        value={path}
                        readOnly
                        placeholder="No folder selected"
                        className="w-full"
                    />
                </div>
                <Button
                    onClick={handleSelect}
                    icon={<FolderOpen className="w-4 h-4"/>}
                    disabled={validating}
                >
                    Browse
                </Button>
            </div>

            {error && (
                <p className="text-sm text-[var(--md-sys-color-error)]">{error}</p>
            )}
        </div>
    );
}
