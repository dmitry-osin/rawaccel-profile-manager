import {
    Copy,
    Download,
    Loader2,
    Pencil,
    Play,
    Settings,
    Star,
    Terminal,
    Trash2,
} from "lucide-react";
import type {Profile} from "../../types";

interface ProfileCardProps {
    profile: Profile;
    isActive: boolean;
    isActivating: boolean;
    onApply: () => void;
    onEdit: () => void;
    onRename: () => void;
    onDuplicate: () => void;
    onExport: () => void;
    onDelete: () => void;
    onSetDefault: () => void;
}

export function ProfileCard({
                                profile,
                                isActive,
                                isActivating,
                                onApply,
                                onEdit,
                                onRename,
                                onDuplicate,
                                onExport,
                                onDelete,
                                onSetDefault,
                            }: ProfileCardProps) {

    return (
        <div
            className="group relative flex flex-col rounded-2xl border
            border-[var(--md-sys-color-outline-variant)]
            bg-[var(--md-sys-color-surface)]
            p-4 shadow-sm transition-all
            hover:border-[var(--md-sys-color-primary)] hover:shadow-md">
            {isActivating && (
                <div
                    className="absolute inset-0 z-20 flex items-center
                    justify-center rounded-2xl
                    bg-[var(--md-sys-color-surface)]/80 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8
                    text-[var(--md-sys-color-primary)] animate-spin"/>
                </div>
            )}

            <div className="flex items-start justify-between">
                <div className="flex flex-wrap gap-2">
                    {profile.is_default && (
                        <span
                            className="inline-flex items-center gap-1 rounded-full
                            bg-[var(--md-sys-color-primary-container)]
                            px-2 py-0.5 text-xs font-medium
                            text-[var(--md-sys-color-on-primary-container)]">
              <Star className="w-3 h-3"/>
              Default
            </span>
                    )}
                    {isActive && (
                        <span
                            className="inline-flex items-center gap-1 rounded-full
                            bg-green-500/10 px-2 py-0.5 text-xs
                            font-medium text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500"/>
              Active
            </span>
                    )}
                </div>

                <button
                    onClick={onDuplicate}
                    disabled={isActivating}
                    className="opacity-0 group-hover:opacity-100 p-1.5
                    rounded-lg text-[var(--md-sys-color-on-surface-variant)]
                    hover:bg-[var(--md-sys-color-surface-variant)]
                    transition-opacity disabled:opacity-50
                    disabled:cursor-not-allowed"
                    title="Copy"
                >
                    <Copy className="w-4 h-4"/>
                </button>
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                <h3 className="text-lg font-semibold text-[var(--md-sys-color-on-surface)]">
                    {profile.name}
                </h3>
                <div className="mt-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                    {profile.bound_processes.length > 0 ? (
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {profile.bound_processes.map((proc) => (
                                <span key={proc} className="inline-flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5"/>
                                    {proc}
                </span>
                            ))}
                        </div>
                    ) : (
                        <em>No bound processes</em>
                    )}
                </div>
            </div>


            <div
                className="flex items-center justify-center gap-1 pt-3 border-t
                border-[var(--md-sys-color-outline-variant)]">
                <button
                    onClick={onSetDefault}
                    disabled={isActivating}
                    title={profile.is_default ? "Default profile" : "Set as default"}
                    className={`p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        profile.is_default
                            ? "text-yellow-400 hover:bg-[var(--md-sys-color-surface-variant)]"
                            : "text-[var(--md-sys-color-on-surface-variant)] " +
                            "hover:bg-[var(--md-sys-color-surface-variant)]"
                    }`}
                >
                    <Star className="w-4 h-4" fill={profile.is_default ? "currentColor" : "none"}/>
                </button>

                {!isActive && (
                    <button
                        onClick={onApply}
                        disabled={isActivating}
                        title="Apply profile"
                        className="p-2 rounded-xl text-[var(--md-sys-color-on-surface-variant)]
                        hover:text-[var(--md-sys-color-primary)]
                        hover:bg-[var(--md-sys-color-surface-variant)]
                        transition-colors disabled:opacity-50
                        disabled:cursor-not-allowed"
                    >
                        {isActivating ? (
                            <Loader2 className="w-4 h-4 animate-spin"/>
                        ) : (
                            <Play className="w-4 h-4"/>
                        )}
                    </button>
                )}

                <button
                    onClick={onRename}
                    disabled={isActivating}
                    title="Rename profile"
                    className="p-2 rounded-xl text-[var(--md-sys-color-on-surface-variant)]
                    hover:text-[var(--md-sys-color-on-surface)]
                    hover:bg-[var(--md-sys-color-surface-variant)]
                    transition-colors disabled:opacity-50
                    disabled:cursor-not-allowed"
                >
                    <Pencil className="w-4 h-4"/>
                </button>

                <button
                    onClick={onEdit}
                    disabled={isActivating}
                    title="Edit profile with RawAccel"
                    className="p-2 rounded-xl
                    text-[var(--md-sys-color-on-surface-variant)]
                    hover:text-[var(--md-sys-color-on-surface)]
                    hover:bg-[var(--md-sys-color-surface-variant)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Settings className="w-4 h-4"/>
                </button>

                <button
                    onClick={onExport}
                    disabled={isActivating}
                    title="Export profile"
                    className="p-2 rounded-xl text-[var(--md-sys-color-on-surface-variant)]
                    hover:text-[var(--md-sys-color-on-surface)]
                    hover:bg-[var(--md-sys-color-surface-variant)]
                    transition-colors disabled:opacity-50
                    disabled:cursor-not-allowed"
                >
                    <Download className="w-4 h-4"/>
                </button>

                <button
                    onClick={onDelete}
                    disabled={isActivating}
                    title="Delete profile"
                    className="p-2 rounded-xl
                    text-[var(--md-sys-color-on-surface-variant)]
                    hover:bg-[var(--md-sys-color-error-container)]
                    hover:text-[var(--md-sys-color-on-error-container)]
                    transition-colors disabled:opacity-50
                    disabled:cursor-not-allowed"
                >
                    <Trash2 className="w-4 h-4"/>
                </button>
            </div>
        </div>
    );
}
