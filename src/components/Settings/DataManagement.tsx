import {Download, Upload} from "lucide-react";
import {invoke} from "@tauri-apps/api/core";
import {open, save} from "@tauri-apps/plugin-dialog";
import {Button} from "../ui/Button";
import type {AppConfig, Profile} from "../../types";

interface DataManagementProps {
    profiles: Profile[];
    onSettingsImported: (config: AppConfig) => void;
    onProfilesImported: () => void;
}

const jsonFilter = {
    name: "JSON",
    extensions: ["json"],
};

function safeFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9\s_-]/g, "").trim() || "profile";
}

export function DataManagement({
                                   profiles,
                                   onSettingsImported,
                                   onProfilesImported,
                               }: DataManagementProps) {
    const handleExportSettings = async () => {
        try {
            const path = await save({
                filters: [jsonFilter],
                defaultPath: "rawaccelman-settings.json",
            });
            if (typeof path === "string") {
                await invoke("export_settings", {path});
            }
        } catch (err) {
            console.error("Failed to export settings:", err);
        }
    };

    const handleImportSettings = async () => {
        try {
            const path = await open({
                multiple: false,
                directory: false,
                filters: [jsonFilter],
            });
            if (typeof path === "string") {
                const config = await invoke<AppConfig>("import_settings", {path});
                onSettingsImported(config);
            }
        } catch (err) {
            console.error("Failed to import settings:", err);
        }
    };

    const handleExportAllProfiles = async () => {
        try {
            const dir = await open({
                directory: true,
                multiple: false,
            });
            if (typeof dir !== "string") return;

            await Promise.all(
                profiles.map((profile) => {
                    const path = `${dir}\\${safeFileName(profile.name)}.json`;
                    return invoke("export_profile", {
                        profileId: profile.id,
                        path,
                    });
                })
            );
        } catch (err) {
            console.error("Failed to export all profiles:", err);
        }
    };

    const handleImportAllProfiles = async () => {
        try {
            const paths = await open({
                multiple: true,
                directory: false,
                filters: [jsonFilter],
            });
            if (!Array.isArray(paths)) return;

            await Promise.all(
                paths.map((path) => invoke("import_profile", {path}))
            );
            onProfilesImported();
        } catch (err) {
            console.error("Failed to import all profiles:", err);
        }
    };

    return (
        <section
            className="rounded-2xl border
            border-[var(--md-sys-color-outline-variant)]
            bg-[var(--md-sys-color-surface)]
            p-4 shadow-sm">
            <h2 className="text-lg font-semibold
            text-[var(--md-sys-color-on-surface)]">
                Data Management
            </h2>
            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                Backup and restore settings and profiles
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                    variant="secondary"
                    icon={<Download className="w-4 h-4"/>}
                    onClick={handleExportSettings}
                >
                    Export Settings
                </Button>
                <Button
                    variant="secondary"
                    icon={<Upload className="w-4 h-4"/>}
                    onClick={handleImportSettings}
                >
                    Import Settings
                </Button>
                <Button
                    variant="secondary"
                    icon={<Download className="w-4 h-4"/>}
                    onClick={handleExportAllProfiles}
                >
                    Export All Profiles
                </Button>
                <Button
                    variant="secondary"
                    icon={<Upload className="w-4 h-4"/>}
                    onClick={handleImportAllProfiles}
                >
                    Import All Profiles
                </Button>
            </div>
        </section>
    );
}
