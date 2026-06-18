import {FolderOpen, RotateCcw} from "lucide-react";
import {open} from "@tauri-apps/plugin-dialog";
import {invoke} from "@tauri-apps/api/core";
import {Button} from "../ui/Button";
import {Input} from "../ui/Input";

interface RawAccelSettingsProps {
    rawaccelPath: string;
    onPathChange: (path: string) => void;
    onRunWizard: () => void;
}

export function RawAccelSettings({
                                     rawaccelPath,
                                     onPathChange,
                                     onRunWizard,
                                 }: RawAccelSettingsProps) {
    const handleBrowse = async () => {
        try {
            const path = await open({
                directory: true,
                multiple: false,
            });
            if (typeof path === "string") {
                await invoke("set_rawaccel_path", {path});
                onPathChange(path);
            }
        } catch (err) {
            console.error("Failed to set RawAccel path:", err);
        }
    };

    const handleOpenAppData = () => {
        invoke("open_app_folder").catch((err) =>
            console.error("Failed to open app data folder:", err)
        );
    };

    const handleOpenRawAccelFolder = () => {
        invoke("open_rawaccel_folder").catch((err) =>
            console.error("Failed to open RawAccel folder:", err)
        );
    };

    const handleRunWizard = () => {
        invoke("run_wizard")
            .then(() => onRunWizard())
            .catch((err) => console.error("Failed to run wizard:", err));
    };

    return (
        <section
            className="rounded-2xl border
            border-[var(--md-sys-color-outline-variant)]
            bg-[var(--md-sys-color-surface)] p-4 shadow-sm">
            <h2 className="text-lg font-semibold
            text-[var(--md-sys-color-on-surface)]">
                RawAccel
            </h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                Path and folder shortcuts
            </p>

            <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-end gap-2">
                    <Input
                        label="RawAccel Directory"
                        value={rawaccelPath}
                        readOnly
                        className="flex-1"
                        placeholder="No folder selected"
                    />
                    <Button
                        variant="secondary"
                        icon={<FolderOpen className="w-4 h-4"/>}
                        onClick={handleBrowse}
                    >
                        Browse
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="secondary"
                        onClick={handleOpenAppData}
                    >
                        Open App Data
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleOpenRawAccelFolder}
                    >
                        Open RawAccel Folder
                    </Button>
                    <Button
                        variant="secondary"
                        icon={<RotateCcw className="w-4 h-4"/>}
                        onClick={handleRunWizard}
                    >
                        Run Wizard
                    </Button>
                </div>
            </div>
        </section>
    );
}
