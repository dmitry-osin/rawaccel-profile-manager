import {create} from "zustand";
import type {AppConfig, ProcessMapping, Profile} from "../types";

interface StoreState {
    settings: AppConfig | null;
    profiles: Profile[];
    mappings: ProcessMapping[];
    activeProfileId: string | null;

    setSettings: (settings: AppConfig | null) => void;
    setProfiles: (profiles: Profile[]) => void;
    setMappings: (mappings: ProcessMapping[]) => void;
    setActiveProfileId: (id: string | null) => void;

    updateSettings: (partial: Partial<AppConfig>) => void;
    addProfile: (profile: Profile) => void;
    updateProfile: (profile: Profile) => void;
    removeProfile: (profileId: string) => void;
    addMapping: (mapping: ProcessMapping) => void;
    updateMapping: (mapping: ProcessMapping) => void;
    removeMapping: (mappingId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
    settings: null,
    profiles: [],
    mappings: [],
    activeProfileId: null,

    setSettings: (settings) => set({settings}),
    setProfiles: (profiles) => set({profiles}),
    setMappings: (mappings) => set({mappings}),
    setActiveProfileId: (id) => set({activeProfileId: id}),

    updateSettings: (partial) =>
        set((state) => ({
            settings: state.settings ? {...state.settings, ...partial} : null,
        })),

    addProfile: (profile) =>
        set((state) => ({profiles: [...state.profiles, profile]})),

    updateProfile: (profile) =>
        set((state) => ({
            profiles: state.profiles.map((p) => (p.id === profile.id ? profile : p)),
        })),

    removeProfile: (profileId) =>
        set((state) => ({
            profiles: state.profiles.filter((p) => p.id !== profileId),
        })),

    addMapping: (mapping) =>
        set((state) => ({mappings: [...state.mappings, mapping]})),

    updateMapping: (mapping) =>
        set((state) => ({
            mappings: state.mappings.map((m) => (m.id === mapping.id ? mapping : m)),
        })),

    removeMapping: (mappingId) =>
        set((state) => ({
            mappings: state.mappings.filter((m) => m.id !== mappingId),
        })),
}));
