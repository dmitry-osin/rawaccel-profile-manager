import {ExternalLink} from "lucide-react";
import {openUrl} from "@tauri-apps/plugin-opener";
import {Button} from "../../ui/Button";

const DOWNLOAD_URL =
    "https://github.com/RawAccelOfficial/rawaccel/releases/latest";

export function DownloadStep() {
    return (
        <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-[var(--md-sys-color-on-surface)]">
                Download RawAccel
            </h2>
            <p className="text-[var(--md-sys-color-on-surface-variant)]">
                RawAccel is required for this application to work. Download the latest
                release from GitHub.
            </p>
            <Button
                icon={<ExternalLink className="w-4 h-4"/>}
                onClick={() => openUrl(DOWNLOAD_URL)}
            >
                Open GitHub Releases
            </Button>
        </div>
    );
}
