import {useCallback, useState} from "react";
import {Plus} from "lucide-react";
import {useProcessWatcher} from "../hooks/useProcessWatcher";
import {useProfiles} from "../hooks/useProfiles";
import {MappingList} from "../components/AutoSwitch/MappingList";
import {MappingModal} from "../components/Modals/MappingModal";
import {ConfirmDelete} from "../components/Modals/ConfirmDelete";
import {Button} from "../components/ui/Button";
import {Input} from "../components/ui/Input";
import {Toggle} from "../components/ui/Toggle";
import type {ProcessMapping} from "../types";

export function AutoSwitchView() {
    const {
        config,
        mappings,
        runningProcesses,
        loading,
        loadProcesses,
        toggleEnabled,
        setDelay,
        addMapping,
        updateMapping,
        deleteMapping,
    } = useProcessWatcher();

    const {profiles, loading: profilesLoading} = useProfiles();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [editingMapping, setEditingMapping] = useState<ProcessMapping | null>(
        null
    );
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const handleAdd = () => {
        setEditingMapping(null);
        setModalMode("add");
        setModalOpen(true);
    };

    const handleEdit = useCallback((mapping: ProcessMapping) => {
        setEditingMapping(mapping);
        setModalMode("edit");
        setModalOpen(true);
    }, []);

    const handleSave = async (processName: string, profileId: string) => {
        if (modalMode === "add") {
            await addMapping(processName, profileId);
        } else if (editingMapping) {
            await updateMapping(editingMapping.id, processName, profileId);
        }
        setModalOpen(false);
    };

    const handleDelete = useCallback((mappingId: string) => {
        setDeleteTargetId(mappingId);
    }, []);

    const handleConfirmDelete = async () => {
        if (!deleteTargetId) return;
        try {
            await deleteMapping(deleteTargetId);
        } catch (err) {
            console.error("Failed to delete mapping:", err);
        } finally {
            setDeleteTargetId(null);
        }
    };

    const isLoading = loading || profilesLoading;

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold
                    text-[var(--md-sys-color-on-surface)]">
                        Auto-Switch
                    </h1>
                    <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                        Automatically apply profiles when matching processes are running
                    </p>
                </div>

                <div
                    className="flex flex-col sm:flex-row sm:items-center
                    gap-4 p-4 rounded-2xl border
                    border-[var(--md-sys-color-outline-variant)]
                    bg-[var(--md-sys-color-surface)]">
                    <Toggle
                        checked={config?.auto_switch_enabled ?? false}
                        onChange={toggleEnabled}
                        label="Enable Auto-Switch"
                    />

                    <div className="flex-1"/>

                    <Input
                        type="number"
                        min={100}
                        step={100}
                        label="Check Delay (ms)"
                        value={config?.process_check_delay_ms ?? 1000}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!Number.isNaN(value) && value >= 100) {
                                void setDelay(value);
                            }
                        }}
                        className="w-full sm:w-40"
                    />
                </div>
            </header>

            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold
                    text-[var(--md-sys-color-on-surface)]">
                        Process Mappings
                    </h2>
                    <Button icon={<Plus className="w-4 h-4"/>} onClick={handleAdd}>
                        Add Mapping
                    </Button>
                </div>

                {isLoading ? (
                    <div className="text-center py-10
                    text-[var(--md-sys-color-on-surface-variant)]">
                        Loading…
                    </div>
                ) : (
                    <MappingList
                        mappings={mappings}
                        profiles={profiles}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </section>

            <MappingModal
                isOpen={modalOpen}
                mode={modalMode}
                mapping={editingMapping}
                profiles={profiles}
                runningProcesses={runningProcesses}
                onRefreshProcesses={loadProcesses}
                onSave={handleSave}
                onCancel={() => setModalOpen(false)}
            />

            <ConfirmDelete
                isOpen={deleteTargetId !== null}
                title="Delete Mapping?"
                message="Are you sure you want to delete this process mapping? This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTargetId(null)}
            />
        </div>
    );
}
