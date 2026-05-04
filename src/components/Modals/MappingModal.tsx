import {useEffect, useState} from "react";
import {RefreshCw} from "lucide-react";
import {Button} from "../ui/Button";
import {Input} from "../ui/Input";
import type {ProcessMapping, Profile} from "../../types";

interface MappingModalProps {
    isOpen: boolean;
    mode: "add" | "edit";
    mapping: ProcessMapping | null;
    profiles: Profile[];
    runningProcesses: string[];
    onRefreshProcesses: () => void;
    onSave: (processName: string, profileId: string) => void;
    onCancel: () => void;
}

export function MappingModal({
                                 isOpen,
                                 mode,
                                 mapping,
                                 profiles,
                                 runningProcesses,
                                 onRefreshProcesses,
                                 onSave,
                                 onCancel,
                             }: MappingModalProps) {
    const [processName, setProcessName] = useState("");
    const [profileId, setProfileId] = useState("");

    useEffect(() => {
        if (isOpen) {
            setProcessName(mapping?.process_name ?? "");
            setProfileId(mapping?.profile_id ?? profiles[0]?.id ?? "");
        }
    }, [isOpen, mapping, profiles]);

    useEffect(() => {
        if (isOpen && runningProcesses.length === 0) {
            onRefreshProcesses();
        }
    }, [isOpen, runningProcesses.length, onRefreshProcesses]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = processName.trim();
        if (trimmed && profileId) {
            onSave(trimmed, profileId);
        }
    };

    const handleProcessSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value) {
            setProcessName(value);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex
            items-center justify-center
            bg-[var(--md-sys-color-scrim)]/60
            backdrop-blur-sm p-4">
            <div
                className="w-full max-w-md rounded-2xl
                border border-[var(--md-sys-color-outline-variant)]
                bg-[var(--md-sys-color-surface)] p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-[var(--md-sys-color-on-surface)]">
                    {mode === "add" ? "Add Mapping" : "Edit Mapping"}
                </h2>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Input
                            label="Process Name"
                            value={processName}
                            onChange={(e) => setProcessName(e.target.value)}
                            placeholder="e.g. cs2.exe"
                        />

                        <div className="flex items-center gap-2">
                            <select
                                value=""
                                onChange={handleProcessSelect}
                                className="flex-1 px-3 py-2 rounded-xl
                                bg-[var(--md-sys-color-surface-variant)]
                                text-[var(--md-sys-color-on-surface)]
                                border border-[var(--md-sys-color-outline-variant)]
                                focus:outline-none focus:border-[var(--md-sys-color-primary)] text-sm"
                            >
                                <option value="">Select running process…</option>
                                {runningProcesses.map((proc) => (
                                    <option key={proc} value={proc}>
                                        {proc}
                                    </option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                variant="secondary"
                                icon={<RefreshCw className="w-4 h-4"/>}
                                onClick={onRefreshProcesses}
                                title="Refresh running processes"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium
                        text-[var(--md-sys-color-on-surface-variant)]">
                            Profile
                        </label>
                        <select
                            value={profileId}
                            onChange={(e) => setProfileId(e.target.value)}
                            className="px-3 py-2 rounded-xl
                            bg-[var(--md-sys-color-surface-variant)]
                            text-[var(--md-sys-color-on-surface)]
                            border border-[var(--md-sys-color-outline-variant)]
                            focus:outline-none focus:border-[var(--md-sys-color-primary)] text-sm"
                        >
                            <option value="">Select profile…</option>
                            {profiles.map((profile) => (
                                <option key={profile.id} value={profile.id}>
                                    {profile.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
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
                            disabled={!processName.trim() || !profileId}
                        >
                            {mode === "add" ? "Add" : "Save"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
