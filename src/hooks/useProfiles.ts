import {useCallback, useEffect, useState} from "react";
import * as api from "../api/tauri";
import {useStore} from "../store/useStore";

export function useProfiles() {
    const profiles = useStore((state) => state.profiles);
    const activeProfileId = useStore((state) => state.activeProfileId);
    const setProfiles = useStore((state) => state.setProfiles);
    const setActiveProfileId = useStore((state) => state.setActiveProfileId);
    const addProfile = useStore((state) => state.addProfile);
    const updateProfile = useStore((state) => state.updateProfile);
    const removeProfile = useStore((state) => state.removeProfile);

    const [loading, setLoading] = useState(profiles.length === 0);

    const load = useCallback(
        async (force = false) => {
            if (!force && profiles.length > 0) {
                return;
            }

            setLoading(true);
            try {
                const [list, active] = await Promise.all([
                    api.getProfiles(),
                    api.getActiveProfile(),
                ]);
                setProfiles(list);
                setActiveProfileId(active?.id ?? null);
            } catch (err) {
                console.error("Failed to load profiles:", err);
            } finally {
                setLoading(false);
            }
        },
        [profiles.length, setProfiles, setActiveProfileId]
    );

    useEffect(() => {
        load();
    }, [load]);

    const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? null;

    const createProfile = async () => {
        const profile = await api.createProfile();
        addProfile(profile);
        setActiveProfileId(profile.id);
        return profile;
    };

    const editProfile = async (id: string) => {
        await api.editProfile(id);
        const profile = await api.getActiveProfile();
        if (profile) {
            updateProfile(profile);
            setActiveProfileId(profile.id);
        }
    };

    const renameProfile = async (id: string, name: string) => {
        const trimmed = name.trim();
        await api.renameProfile(id, trimmed);
        const list = await api.getProfiles();
        setProfiles(list);
    };

    const duplicateProfile = async (id: string) => {
        const profile = await api.duplicateProfile(id);
        addProfile(profile);
        return profile;
    };

    const deleteProfile = async (id: string) => {
        await api.deleteProfile(id);
        removeProfile(id);
        const active = await api.getActiveProfile();
        setActiveProfileId(active?.id ?? null);
    };

    const applyProfile = async (id: string) => {
        await api.applyProfile(id);
        setActiveProfileId(id);
    };

    const setDefaultProfile = async (id: string) => {
        await api.setDefaultProfile(id);
        const list = await api.getProfiles();
        setProfiles(list);
    };

    const exportProfile = (id: string, path: string) =>
        api.exportProfile(id, path);

    const importProfile = async (path: string) => {
        const profile = await api.importProfile(path);
        addProfile(profile);
        return profile;
    };

    return {
        profiles,
        activeProfile,
        loading,
        load,
        createProfile,
        editProfile,
        renameProfile,
        duplicateProfile,
        deleteProfile,
        applyProfile,
        setDefaultProfile,
        exportProfile,
        importProfile,
    };
}
