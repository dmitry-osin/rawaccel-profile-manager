import React from "react";
import type {ProcessMapping, Profile} from "../../types";
import {MappingRow} from "./MappingRow";

interface MappingListProps {
    mappings: ProcessMapping[];
    profiles: Profile[];
    onEdit: (mapping: ProcessMapping) => void;
    onDelete: (mappingId: string) => void;
}

function MappingListComponent({
                                  mappings,
                                  profiles,
                                  onEdit,
                                  onDelete,
                              }: MappingListProps) {
    const profileName = (profileId: string) =>
        profiles.find((p) => p.id === profileId)?.name ?? "Unknown profile";

    if (mappings.length === 0) {
        return (
            <div className="text-center py-10
            text-[var(--md-sys-color-on-surface-variant)]">
                No process mappings yet. Click "Add Mapping" to link a process to a
                profile.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {mappings.map((mapping) => (
                <MappingRow
                    key={mapping.id}
                    processName={mapping.process_name}
                    profileName={profileName(mapping.profile_id)}
                    onEdit={() => onEdit(mapping)}
                    onDelete={() => onDelete(mapping.id)}
                />
            ))}
        </div>
    );
}

export const MappingList = React.memo(MappingListComponent);
