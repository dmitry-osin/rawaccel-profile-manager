import {ExternalLink, User} from "lucide-react";
import {openUrl} from "@tauri-apps/plugin-opener";
import {Button} from "../components/ui/Button";

const REPO_URL = "https://github.com/dmitry-osin/rawaccel-profiles-rs";

const technologies = [
    "Tauri",
    "Rust",
    "React",
    "Material Design 3",
];

export function AboutView() {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div
                className="w-full max-w-md rounded-2xl border
                border-[var(--md-sys-color-outline-variant)]
                bg-[var(--md-sys-color-surface)] p-8 shadow-lg text-center">
                <div className="flex justify-center">
                    <img
                        src="/tauri.svg"
                        alt="Application logo"
                        className="h-20 w-20"
                    />
                </div>

                <h1 className="mt-4 text-2xl font-bold
                text-[var(--md-sys-color-on-surface)]">
                    RawAccel Profile Manager
                </h1>
                <p className="text-sm
                text-[var(--md-sys-color-on-surface-variant)]">
                    Version 1.0.0
                </p>

                <div className="mt-6 flex flex-col gap-2 text-sm
                text-[var(--md-sys-color-on-surface-variant)]">
                    <div className="flex items-center justify-center gap-2">
                        <User className="w-4 h-4"/>
                        <span>Created by Your Name</span>
                    </div>
                </div>

                <Button
                    className="mt-6"
                    variant="secondary"
                    icon={<ExternalLink className="w-4 h-4"/>}
                    onClick={() => openUrl(REPO_URL)}
                >
                    View on GitHub
                </Button>

                <div className="mt-8 pt-6 border-t
                border-[var(--md-sys-color-outline-variant)]">
                    <p className="text-xs font-medium uppercase tracking-wide
                    text-[var(--md-sys-color-on-surface-variant)]">
                        Built with
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                        {technologies.map((tech) => (
                            <span
                                key={tech}
                                className="inline-flex items-center gap-1 rounded-full
                                bg-[var(--md-sys-color-secondary-container)]
                                px-3 py-1 text-xs font-medium
                                text-[var(--md-sys-color-on-secondary-container)]"
                            >
                {tech}
              </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
