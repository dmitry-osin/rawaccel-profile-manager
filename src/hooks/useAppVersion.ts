import {useEffect, useState} from "react";
import {getVersion} from "@tauri-apps/api/app";

export function useAppVersion() {
    const [version, setVersion] = useState<string>("dev");

    useEffect(() => {
        let mounted = true;

        getVersion()
            .then((resolvedVersion) => {
                if (mounted) {
                    setVersion(resolvedVersion);
                }
            })
            .catch((err) => {
                console.error("Failed to resolve app version:", err);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return version;
}
