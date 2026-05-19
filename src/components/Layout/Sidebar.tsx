import {Info, Layers, RefreshCw, Settings} from "lucide-react";

export type View = "profiles" | "auto-switch" | "settings" | "about";

interface SidebarProps {
    active: View;
    onChange: (view: View) => void;
}

const items: { id: View; label: string; icon: React.ElementType }[] = [
    {id: "profiles", label: "Profiles", icon: Layers},
    {id: "auto-switch", label: "Auto-Switch", icon: RefreshCw},
    {id: "settings", label: "Settings", icon: Settings},
    {id: "about", label: "About", icon: Info},
];

export function Sidebar({active, onChange}: SidebarProps) {
    return (
        <nav
            className="w-60 flex flex-col bg-[var(--md-sys-color-surface)] border-r border-[var(--md-sys-color-outline-variant)]">
            <div className="flex-1 py-2 flex flex-col gap-1 px-3">
                {items.slice(0, 3).map((item) => {
                    const isActive = active === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onChange(item.id)}
                            className={`flex items-center gap-3 px-4 py-2.5 
                            rounded-xl text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-[var(--md-sys-color-primary-container)] " +
                                    "text-[var(--md-sys-color-on-primary-container)]"
                                    : "text-[var(--md-sys-color-on-surface-variant)] " +
                                    "hover:bg-[var(--md-sys-color-surface-variant)]"
                            }`}
                        >
                            <Icon className="w-5 h-5"/>
                            {item.label}
                        </button>
                    );
                })}
            </div>

            <div className="p-3 border-t border-[var(--md-sys-color-outline-variant)]">
                {(() => {
                    const item = items[3];
                    const isActive = active === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 
                            rounded-xl text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-[var(--md-sys-color-primary-container)] " +
                                    "text-[var(--md-sys-color-on-primary-container)]"
                                    : "text-[var(--md-sys-color-on-surface-variant)] " +
                                    "hover:bg-[var(--md-sys-color-surface-variant)]"
                            }`}
                        >
                            <Icon className="w-5 h-5"/>
                            {item.label}
                        </button>
                    );
                })()}
            </div>
        </nav>
    );
}
