import {Pencil, Terminal, Trash2} from "lucide-react";
import {Button} from "../ui/Button";

interface MappingRowProps {
    processName: string;
    profileName: string;
    onEdit: () => void;
    onDelete: () => void;
}

export function MappingRow({
                               processName,
                               profileName,
                               onEdit,
                               onDelete,
                           }: MappingRowProps) {
    return (
        <div className="flex items-center justify-between gap-4
    rounded-2xl border border-[var(--md-sys-color-outline-variant)]
    bg-[var(--md-sys-color-surface)] p-4 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center
        justify-center rounded-xl
        bg-[var(--md-sys-color-primary-container)]
        text-[var(--md-sys-color-on-primary-container)]">
                    <Terminal className="w-5 h-5"/>
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium
          text-[var(--md-sys-color-on-surface)]">
                        {processName}
                    </p>
                    <p className="truncate text-xs
          text-[var(--md-sys-color-on-surface-variant)]">
                        → {profileName}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <Button
                    size="sm"
                    variant="ghost"
                    icon={<Pencil className="w-3.5 h-3.5"/>}
                    onClick={onEdit}
                >
                    Edit
                </Button>
                <Button
                    size="sm"
                    variant="danger"
                    icon={<Trash2 className="w-3.5 h-3.5"/>}
                    onClick={onDelete}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}
