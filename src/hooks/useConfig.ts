import {useCallback, useEffect, useState} from "react";
import * as api from "../api/tauri";
import {useStore} from "../store/useStore";
import type {AppConfig} from "../types";

export function useConfig() {
    const config = useStore((state) => state.settings);
    const setConfig = useStore((state) => state.setSettings);
    const updateConfigInStore = useStore((state) => state.updateSettings);

    const [loading, setLoading] = useState(true);
    const [autostart, setAutostart] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [cfg, auto] = await Promise.all([
                api.getConfig(),
                api.isAutostartEnabled(),
            ]);
            setConfig(cfg);
            setAutostart(auto);
        } catch (err) {
            console.error("Failed to load config:", err);
        } finally {
            setLoading(false);
        }
    }, [setConfig]);

    useEffect(() => {
        load();
    }, [load]);

    const updateConfig = async (partial: Partial<AppConfig>) => {
        if (!config) return;
        const next = {...config, ...partial};
        try {
            await api.setConfig(next);
            updateConfigInStore(partial);
        } catch (err) {
            console.error("Failed to update config:", err);
        }
    };

    const setAutostartEnabled = async (enabled: boolean) => {
        try {
            await api.setAutostart(enabled);
            setAutostart(enabled);
        } catch (err) {
            console.error("Failed to set autostart:", err);
        }
    };

    return {
        config,
        autostart,
        loading,
        load,
        updateConfig,
        setAutostartEnabled,
    };
}
