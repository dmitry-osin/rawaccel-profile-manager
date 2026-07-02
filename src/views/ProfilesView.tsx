import {useEffect, useState} from "react";
import {FileDown, Plus} from "lucide-react";
import {open, save} from "@tauri-apps/plugin-dialog";
import {useProfiles} from "../hooks/useProfiles";
import {useErrorModal} from "../hooks/useErrorModal";
import {ProfileList} from "../components/Profile/ProfileList";
import {ConfirmDelete} from "../components/Modals/ConfirmDelete";
import {RenameProfile} from "../components/Modals/RenameProfile";
import {ErrorModal} from "../components/Modals/ErrorModal";
import {Button} from "../components/ui/Button";
import type {Profile} from "../types";

interface ProfilesViewProps {
    setIsRawAccelOpen: (value: boolean) => void;
}

const jsonFilter = {
    name: "JSON",
    extensions: ["json"],
};

function formatError(err: unknown): string {
    if (err instanceof Error) return err.message;
    return String(err);
}

export function ProfilesView({setIsRawAccelOpen}: ProfilesViewProps) {
    const {
        profiles,
        activeProfile,
        loading,
        load,
        createProfile,
        editProfile,
        renameProfile,
        duplicateProfile,
        deleteProfile,
        applyProfile,
        setDefaultProfile,
        exportProfile,
        importProfile,
    } = useProfiles();

    const {error, showError, closeError} = useErrorModal("Profile Error");
    const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
    const [renameTarget, setRenameTarget] = useState<Profile | null>(null);
    const [activatingProfileId, setActivatingProfileId] = useState<string | null>(
        null
    );

    const activeProfileId = activeProfile?.id ?? null;

    useEffect(() => {
        if (!activatingProfileId) return;

        const blockKeys = (event: KeyboardEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };

        window.addEventListener("keydown", blockKeys, true);
        window.addEventListener("keyup", blockKeys, true);
        return () => {
            window.removeEventListener("keydown", blockKeys, true);
            window.removeEventListener("keyup", blockKeys, true);
        };
    }, [activatingProfileId]);

    const handleCreateProfile = async () => {
        setIsRawAccelOpen(true);
        try {
            await createProfile();
            await load();
        } catch (err) {
            console.error("Failed to create profile:", err);
            showError(formatError(err), "Failed to create profile");
        } finally {
            setIsRawAccelOpen(false);
        }
    };

    const handleEditProfile = async (id: string) => {
        setIsRawAccelOpen(true);
        try {
            await editProfile(id);
            await load();
        } catch (err) {
            console.error("Failed to edit profile:", err);
            showError(formatError(err), "Failed to edit profile");
        } finally {
            setIsRawAccelOpen(false);
        }
    };

    const handleImport = async () => {
        try {
            const path = await open({
                multiple: false,
                directory: false,
                filters: [jsonFilter],
            });
            if (typeof path === "string") {
                await importProfile(path);
            }
        } catch (err) {
            console.error("Failed to import profile:", err);
            showError(formatError(err), "Failed to import profile");
        }
    };

    const handleExport = async (profile: Profile) => {
        try {
            const safeName = profile.name.replace(/[^a-zA-Z0-9\s_-]/g, "").trim();
            const defaultPath = `${safeName || "profile"}.json`;
            const path = await save({
                filters: [jsonFilter],
                defaultPath,
            });
            if (typeof path === "string") {
                await exportProfile(profile.id, path);
            }
        } catch (err) {
            console.error("Failed to export profile:", err);
            showError(formatError(err), "Failed to export profile");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deleteProfile(deleteTarget.id);
            await load();
        } catch (err) {
            console.error("Failed to delete profile:", err);
            showError(formatError(err), "Failed to delete profile");
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleRenameSave = async (name: string) => {
        if (!renameTarget) return;
        try {
            await renameProfile(renameTarget.id, name);
            await load();
        } catch (err) {
            console.error("Failed to rename profile:", err);
            showError(formatError(err), "Failed to rename profile");
        } finally {
            setRenameTarget(null);
        }
    };

    const handleApply = async (id: string) => {
        setActivatingProfileId(id);
        try {
            await applyProfile(id);
        } catch (err) {
            console.error("Failed to apply profile:", err);
            showError(formatError(err), "Failed to apply profile");
        } finally {
            setActivatingProfileId(null);
        }
    };

    const handleDuplicate = async (id: string) => {
        try {
            await duplicateProfile(id);
            await load();
        } catch (err) {
            console.error("Failed to duplicate profile:", err);
            showError(formatError(err), "Failed to duplicate profile");
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await setDefaultProfile(id);
            await load();
        } catch (err) {
            console.error("Failed to set default profile:", err);
            showError(formatError(err), "Failed to set default profile");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col sm:flex-row
            sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold
                    text-[var(--md-sys-color-on-surface)]">
                        Profiles
                    </h1>
                    <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                        Manage and apply your RawAccel configurations
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="secondary"
                        icon={<FileDown className="w-4 h-4"/>}
                        onClick={handleImport}
                    >
                        Import
                    </Button>
                    <Button
                        icon={<Plus className="w-4 h-4"/>}
                        onClick={handleCreateProfile}
                    >
                        Create Profile
                    </Button>
                </div>
            </header>

            {loading ? (
                <div className="text-center py-12
                text-[var(--md-sys-color-on-surface-variant)]">
                    Loading profiles…
                </div>
            ) : (
                <ProfileList
                    profiles={profiles}
                    activeProfileId={activeProfileId}
                    activatingProfileId={activatingProfileId}
                    onApply={handleApply}
                    onEdit={handleEditProfile}
                    onRename={(id) =>
                        setRenameTarget(profiles.find((p) => p.id === id) ?? null)
                    }
                    onDuplicate={handleDuplicate}
                    onExport={(id) => {
                        const profile = profiles.find((p) => p.id === id);
                        if (profile) void handleExport(profile);
                    }}
                    onDelete={(id) =>
                        setDeleteTarget(profiles.find((p) => p.id === id) ?? null)
                    }
                    onSetDefault={handleSetDefault}
                />
            )}

            <ConfirmDelete
                isOpen={deleteTarget !== null}
                profileName={deleteTarget?.name ?? ""}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />

            <RenameProfile
                isOpen={renameTarget !== null}
                currentName={renameTarget?.name ?? ""}
                onSave={handleRenameSave}
                onCancel={() => setRenameTarget(null)}
            />

            <ErrorModal
                isOpen={error.open}
                title={error.title}
                message={error.message}
                onClose={closeError}
            />
        </div>
    );
}
