import { invoke } from "@tauri-apps/api/core";
import type { AppConfig, ProcessMapping, Profile } from "../types";

// Config

export function getConfig() {
  return invoke<AppConfig>("get_config");
}

export function setConfig(config: AppConfig) {
  return invoke("set_config", { config });
}

export function setRawaccelPath(path: string) {
  return invoke("set_rawaccel_path", { path });
}

export function openAppFolder() {
  return invoke("open_app_folder");
}

export function openRawaccelFolder() {
  return invoke("open_rawaccel_folder");
}

export function runWizard() {
  return invoke("run_wizard");
}

export function isAdmin() {
  return invoke<boolean>("is_admin");
}

export function restartAsAdmin() {
  return invoke("restart_as_admin");
}

export function exportSettings(path: string) {
  return invoke("export_settings", { path });
}

export function importSettings(path: string) {
  return invoke<AppConfig>("import_settings", { path });
}

// Profiles

export function getProfiles() {
  return invoke<Profile[]>("get_profiles_command");
}

export function getActiveProfile() {
  return invoke<Profile | null>("get_active_profile_command");
}

export function createProfile() {
  return invoke<Profile>("create_profile");
}

export function editProfile(profileId: string) {
  return invoke("edit_profile", { profileId });
}

export function renameProfile(profileId: string, newName: string) {
  return invoke("rename_profile", { profileId, newName });
}

export function duplicateProfile(profileId: string) {
  return invoke<Profile>("duplicate_profile", { profileId });
}

export function deleteProfile(profileId: string) {
  return invoke("delete_profile", { profileId });
}

export function applyProfile(profileId: string) {
  return invoke("apply_profile", { profileId });
}

export function setDefaultProfile(profileId: string) {
  return invoke("set_default_profile", { profileId });
}

export function exportProfile(profileId: string, path: string) {
  return invoke("export_profile", { profileId, path });
}

export function importProfile(path: string) {
  return invoke<Profile>("import_profile", { path });
}

// Process watcher / mappings

export function getRunningProcesses() {
  return invoke<string[]>("get_running_processes");
}

export function getMappings() {
  return invoke<ProcessMapping[]>("get_mappings");
}

export function addMapping(processName: string, profileId: string) {
  return invoke("add_mapping", { processName, profileId });
}

export function updateMapping(
  mappingId: string,
  processName: string,
  profileId: string
) {
  return invoke("update_mapping", {
    mappingId,
    processName,
    profileId,
  });
}

export function deleteMapping(mappingId: string) {
  return invoke("delete_mapping", { mappingId });
}

// Autostart

export function setAutostart(enabled: boolean) {
  return invoke("set_autostart", { enabled });
}

export function isAutostartEnabled() {
  return invoke<boolean>("get_autostart");
}

// RawAccel

export function cancelRawaccelOperation() {
  return invoke("cancel_rawaccel_operation");
}
