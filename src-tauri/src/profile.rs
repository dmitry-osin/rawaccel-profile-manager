use std::fs;
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

use crate::error::{Error, Result};
use crate::rawaccel;
use crate::{config, notifications};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct ProfileMeta {
    name: String,
    is_default: bool,
    bound_processes: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Profile {
    pub id: Uuid,
    pub name: String,
    pub is_default: bool,
    pub bound_processes: Vec<String>,
    pub settings_json: Value,
}

pub fn get_profile(id: Uuid) -> Result<Option<Profile>> {
    let meta_path = get_profile_meta_path(id)?;
    if !meta_path.is_file() {
        return Ok(None);
    }

    let meta: ProfileMeta = serde_json::from_str(&fs::read_to_string(&meta_path)?)?;
    let settings_path = get_profile_settings_path(id)?;
    let settings_json = if settings_path.is_file() {
        serde_json::from_str(&fs::read_to_string(&settings_path)?)?
    } else {
        Value::Null
    };

    Ok(Some(Profile {
        id,
        name: meta.name,
        is_default: meta.is_default,
        bound_processes: meta.bound_processes,
        settings_json,
    }))
}

pub fn get_profiles() -> Result<Vec<Profile>> {
    let dir = get_profiles_dir()?;
    if !dir.is_dir() {
        return Ok(Vec::new());
    }

    let mut profiles = Vec::new();
    for entry in fs::read_dir(&dir)? {
        let entry = entry?;
        if !entry.file_type()?.is_dir() {
            continue;
        }

        let file_name = entry.file_name();
        let name = file_name.to_string_lossy();
        if let Ok(id) = Uuid::parse_str(&name) {
            if let Some(profile) = get_profile(id)? {
                profiles.push(profile);
            }
        }
    }

    profiles.sort_by_key(|x| !x.is_default);

    Ok(profiles)
}

pub fn get_active_profile() -> Result<Option<Profile>> {
    let cfg = config::create_or_load_config()?;
    match cfg.active_profile_id {
        Some(id) => get_profile(id),
        None => Ok(None),
    }
}

pub fn save_profile(profile: &Profile) -> Result<()> {
    create_profile_dir(profile.id)?;

    let meta = ProfileMeta {
        name: profile.name.clone(),
        is_default: profile.is_default,
        bound_processes: profile.bound_processes.clone(),
    };

    let meta_content = serde_json::to_string_pretty(&meta)?;
    fs::write(get_profile_meta_path(profile.id)?, meta_content)?;

    let settings_content = serde_json::to_string_pretty(&profile.settings_json)?;
    fs::write(get_profile_settings_path(profile.id)?, settings_content)?;

    Ok(())
}

fn set_active_profile(id: Option<Uuid>) -> Result<()> {
    let mut cfg = config::create_or_load_config()?;
    cfg.active_profile_id = id;
    config::save_config(cfg)
}

fn default_profile() -> Result<Option<Profile>> {
    get_profiles()?
        .into_iter()
        .find(|p| p.is_default)
        .map(Ok)
        .transpose()
}

pub fn apply_default_profile() -> Result<()> {
    if let Some(profile) = default_profile()? {
        apply_profile_sync(profile.id)?;
    } else {
        set_active_profile(None)?;
    }
    Ok(())
}

fn generate_profile_name() -> Result<String> {
    let base = "New Profile";
    let existing: Vec<String> = get_profiles()?.into_iter().map(|p| p.name).collect();

    if !existing.contains(&base.to_string()) {
        return Ok(base.to_string());
    }

    let mut index = 1;
    loop {
        let candidate = format!("{base} ({index})");
        if !existing.contains(&candidate) {
            return Ok(candidate);
        }
        index += 1;
    }
}

fn get_profiles_dir() -> Result<PathBuf> {
    Ok(config::get_app_data_dir()?.join("profiles"))
}

fn get_profile_dir(id: Uuid) -> Result<PathBuf> {
    Ok(get_profiles_dir()?.join(id.to_string()))
}

fn get_profile_meta_path(id: Uuid) -> Result<PathBuf> {
    Ok(get_profile_dir(id)?.join("profile.json"))
}

fn get_profile_settings_path(id: Uuid) -> Result<PathBuf> {
    Ok(get_profile_dir(id)?.join("settings.json"))
}

fn create_profile_dir(id: Uuid) -> Result<()> {
    fs::create_dir_all(get_profile_dir(id)?)?;
    Ok(())
}

// Tauri profile commands

#[tauri::command]
pub async fn create_profile() -> Result<Profile> {
    let previous_active = get_active_profile()?;

    if rawaccel::is_rawaccel_running() {
        rawaccel::stop_rawaccel_process()?;
    }

    rawaccel::backup_settings()?;
    rawaccel::remove_settings()?;
    rawaccel::write_default_settings()?;

    let child = rawaccel::run_rawaccel_process()?;
    rawaccel::wait_rawaccel_process(child).await?;

    let settings_json = rawaccel::read_settings()?;
    let is_first = get_profiles()?.is_empty();

    let profile = Profile {
        id: Uuid::new_v4(),
        name: generate_profile_name()?,
        is_default: is_first,
        bound_processes: Vec::new(),
        settings_json,
    };

    save_profile(&profile)?;

    if profile.is_default {
        set_active_profile(Some(profile.id))?;
    }

    if let Some(previous) = previous_active {
        apply_profile_sync(previous.id)?;
    }

    Ok(profile)
}

#[allow(non_snake_case)]
#[tauri::command]
pub async fn edit_profile(profileId: Uuid) -> Result<()> {
    let previous_active = get_active_profile()?;
    let mut profile = get_profile(profileId)?.ok_or(Error::ProfileNotFound)?;

    if rawaccel::is_rawaccel_running() {
        rawaccel::stop_rawaccel_process()?;
    }

    rawaccel::backup_settings()?;
    rawaccel::remove_settings()?;
    rawaccel::write_settings(&profile.settings_json)?;

    let child = rawaccel::run_rawaccel_process()?;
    rawaccel::wait_rawaccel_process(child).await?;

    profile.settings_json = rawaccel::read_settings()?;
    save_profile(&profile)?;

    if let Some(previous) = previous_active {
        if previous.id != profileId {
            apply_profile_sync(previous.id)?;
        }
    }

    Ok(())
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn rename_profile(profileId: Uuid, newName: String) -> Result<()> {
    let mut profile = get_profile(profileId)?.ok_or(Error::ProfileNotFound)?;
    profile.name = newName;
    save_profile(&profile)
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn duplicate_profile(profileId: Uuid) -> Result<Profile> {
    let source = get_profile(profileId)?.ok_or(Error::ProfileNotFound)?;

    let mut copy = source;
    copy.id = Uuid::new_v4();
    copy.name = format!("{} (copy)", copy.name);
    copy.is_default = false;
    copy.bound_processes = Vec::new();

    save_profile(&copy)?;
    Ok(copy)
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn delete_profile(profileId: Uuid) -> Result<()> {
    let profile = get_profile(profileId)?.ok_or(Error::ProfileNotFound)?;
    let cfg = config::create_or_load_config()?;

    if cfg.active_profile_id == Some(profileId) {
        apply_default_profile()?;
    }

    fs::remove_dir_all(get_profile_dir(profileId)?)?;

    if profile.is_default {
        let mut remaining = get_profiles()?;
        if let Some(first) = remaining.first_mut() {
            first.is_default = true;
            save_profile(first)?;
        }
    }

    Ok(())
}

#[allow(non_snake_case)]
pub fn apply_profile_sync(profileId: Uuid) -> Result<()> {
    let profile = get_profile(profileId)?.ok_or(Error::ProfileNotFound)?;

    rawaccel::apply_profile_settings(&get_profile_settings_path(profileId)?)?;
    set_active_profile(Some(profileId))?;
    notifications::notify_profile_switch(&profile.name);
    notifications::emit_profile_switched(profileId, &profile.name);

    Ok(())
}

#[allow(non_snake_case)]
#[tauri::command]
pub async fn apply_profile(profileId: Uuid) -> Result<()> {
    tokio::task::spawn_blocking(move || apply_profile_sync(profileId))
        .await
        .map_err(|err| Error::Io(format!("apply profile failed: {err}")))?
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn set_default_profile(profileId: Uuid) -> Result<()> {
    let mut profiles = get_profiles()?;
    let mut changed = false;

    for profile in &mut profiles {
        if profile.id == profileId {
            if !profile.is_default {
                profile.is_default = true;
                changed = true;
            }
        } else if profile.is_default {
            profile.is_default = false;
            changed = true;
        }
    }

    if changed {
        for profile in profiles {
            save_profile(&profile)?;
        }
    }

    Ok(())
}

#[tauri::command]
pub fn get_profiles_command() -> Result<Vec<Profile>> {
    get_profiles()
}

#[tauri::command]
pub fn get_active_profile_command() -> Result<Option<Profile>> {
    get_active_profile()
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn export_profile(profileId: Uuid, path: String) -> Result<()> {
    let source = get_profile_settings_path(profileId)?;
    if !source.is_file() {
        return Err(Error::ProfileNotFound);
    }
    fs::copy(&source, &path)?;
    Ok(())
}

#[tauri::command]
pub fn import_profile(path: String) -> Result<Profile> {
    let content = fs::read_to_string(&path)?;
    let settings_json: Value = serde_json::from_str(&content)?;

    let name = Path::new(&path)
        .file_stem()
        .map(|stem| stem.to_string_lossy().into_owned())
        .unwrap_or_else(|| "Imported Profile".to_string());

    let profile = Profile {
        id: Uuid::new_v4(),
        name,
        is_default: false,
        bound_processes: Vec::new(),
        settings_json,
    };

    save_profile(&profile)?;
    Ok(profile)
}
