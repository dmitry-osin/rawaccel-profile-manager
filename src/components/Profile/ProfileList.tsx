import type {Profile} from "../../types";
import {ProfileCard} from "./ProfileCard";

interface ProfileListProps {
    profiles: Profile[];
    activeProfileId: string | null;
    activatingProfileId: string | null;
    onApply: (id: string) => void;
    onEdit: (id: string) => void;
    onRename: (id: string) => void;
    onDuplicate: (id: string) => void;
    onExport: (id: string) => void;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
}

export function ProfileList({
                                profiles,
                                activeProfileId,
                                activatingProfileId,
                                onApply,
                                onEdit,
                                onRename,
                                onDuplicate,
                                onExport,
                                onDelete,
                                onSetDefault,
                            }: ProfileListProps) {
    if (profiles.length === 0) {
        return (
            <div className="text-center py-12
            text-[var(--md-sys-color-on-surface-variant)]">
                No profiles yet. Click "Create Profile" to get started.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {profiles.map((profile) => (
                <ProfileCard
                    key={profile.id}
                    profile={profile}
                    isActive={activeProfileId === profile.id}
                    isActivating={activatingProfileId === profile.id}
                    onApply={() => onApply(profile.id)}
                    onEdit={() => onEdit(profile.id)}
                    onRename={() => onRename(profile.id)}
                    onDuplicate={() => onDuplicate(profile.id)}
                    onExport={() => onExport(profile.id)}
                    onDelete={() => onDelete(profile.id)}
                    onSetDefault={() => onSetDefault(profile.id)}
                />
            ))}
        </div>
    );
}
