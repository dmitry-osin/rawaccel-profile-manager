import {useCallback, useEffect, useState} from "react";
import * as api from "../api/tauri";
import {useStore} from "../store/useStore";

export function useProcessWatcher() {
    const config = useStore((state) => state.settings);
    const mappings = useStore((state) => state.mappings);
    const setMappings = useStore((state) => state.setMappings);
    const removeMappingFromStore = useStore((state) => state.removeMapping);
    const updateConfigInStore = useStore((state) => state.updateSettings);

    const [runningProcesses, setRunningProcesses] = useState<string[]>([]);
    const [loading, setLoading] = useState(mappings.length === 0);

    const loadConfig = useCallback(async () => {
        try {
            const list = await api.getMappings();
            setMappings(list);
        } catch (err) {
            console.error("Failed to load mappings:", err);
        }
    }, [setMappings]);

    const loadProcesses = useCallback(async () => {
        try {
            const processes = await api.getRunningProcesses();
            setRunningProcesses(processes);
        } catch (err) {
            console.error("Failed to load running processes:", err);
        }
    }, []);

    const load = useCallback(
        async (force = false) => {
            const shouldLoadMappings = force || mappings.length === 0;
            if (!shouldLoadMappings && !force) {
                return;
            }

            setLoading(true);
            if (shouldLoadMappings) {
                await Promise.all([loadConfig(), loadProcesses()]);
            } else {
                await loadProcesses();
            }
            setLoading(false);
        },
        [loadConfig, loadProcesses, mappings.length]
    );

    useEffect(() => {
        load();
    }, [load]);

    const toggleEnabled = (enabled: boolean) => {
        if (!config) return;
        api
            .setConfig({...config, auto_switch_enabled: enabled})
            .then(() => {
                updateConfigInStore({auto_switch_enabled: enabled});
            })
            .catch((err) => console.error("Failed to toggle auto-switch:", err));
    };

    const setDelay = (delayMs: number) => {
        if (!config) return;
        api
            .setConfig({...config, process_check_delay_ms: delayMs})
            .then(() => {
                updateConfigInStore({process_check_delay_ms: delayMs});
            })
            .catch((err) => console.error("Failed to set delay:", err));
    };

    const addMapping = async (processName: string, profileId: string) => {
        await api.addMapping(processName, profileId);
        const list = await api.getMappings();
        setMappings(list);
    };

    const updateMapping = async (
        mappingId: string,
        processName: string,
        profileId: string
    ) => {
        await api.updateMapping(mappingId, processName, profileId);
        const list = await api.getMappings();
        setMappings(list);
    };

    const deleteMapping = async (mappingId: string) => {
        await api.deleteMapping(mappingId);
        removeMappingFromStore(mappingId);
    };

    return {
        config,
        mappings,
        runningProcesses,
        loading,
        load,
        loadProcesses,
        toggleEnabled,
        setDelay,
        addMapping,
        updateMapping,
        deleteMapping,
    };
}
