use std::collections::HashSet;
use std::thread;
use std::time::Duration;

use sysinfo::{ProcessRefreshKind, ProcessesToUpdate, RefreshKind, System};
use tokio::runtime;
use tokio::task;
use tokio::time::sleep;
use uuid::Uuid;

use crate::config::{self, AppConfig, ProcessMapping};
use crate::error::{Error, Result};
use crate::profile;

pub fn start() {
    thread::spawn(|| {
        let rt = runtime::Runtime::new().expect("failed to create tokio runtime");
        rt.block_on(watch());
    });
}

async fn watch() {
    let mut system = System::new_with_specifics(
        RefreshKind::nothing().with_processes(ProcessRefreshKind::everything()),
    );

    loop {
        let delay = match config::create_or_load_config() {
            Ok(cfg) => {
                if cfg.auto_switch_enabled {
                    system.refresh_processes_specifics(
                        ProcessesToUpdate::All,
                        true,
                        ProcessRefreshKind::everything(),
                    );
                    tick(&cfg, &system).await;
                }
                cfg.process_check_delay_ms
            }
            Err(err) => {
                eprintln!("auto-switch: failed to load config: {err}");
                1000
            }
        };

        sleep(Duration::from_millis(delay)).await;
    }
}

async fn tick(cfg: &AppConfig, system: &System) {
    let processes = running_process_names(system);
    let mappings = &cfg.mappings;
    let active_id = cfg.active_profile_id;

    let default_id = profile::get_profiles()
        .ok()
        .and_then(|profiles| profiles.into_iter().find(|p| p.is_default).map(|p| p.id));

    let matched = mappings
        .iter()
        .find(|mapping| processes.contains(&mapping.process_name.to_lowercase()));

    match matched {
        Some(mapping) if active_id != Some(mapping.profile_id) => {
            let profile_id = mapping.profile_id;
            if let Err(err) =
                task::spawn_blocking(move || profile::apply_profile_sync(profile_id)).await
            {
                eprintln!("auto-switch: apply profile failed: {err}");
            }
        }
        None if active_id != default_id && default_id.is_some() => {
            if let Err(err) = task::spawn_blocking(profile::apply_default_profile).await {
                eprintln!("auto-switch: apply default profile failed: {err}");
            }
        }
        _ => {}
    }
}

fn running_process_names(system: &System) -> HashSet<String> {
    system
        .processes()
        .values()
        .map(|process| process.name().to_string_lossy().to_lowercase())
        .collect()
}

// Tauri watcher commands

#[tauri::command]
pub fn get_running_processes() -> Result<Vec<String>> {
    let mut system = System::new_with_specifics(
        RefreshKind::nothing().with_processes(ProcessRefreshKind::everything()),
    );
    system.refresh_processes_specifics(
        ProcessesToUpdate::All,
        true,
        ProcessRefreshKind::everything(),
    );

    let mut names: Vec<String> = system
        .processes()
        .values()
        .map(|process| process.name().to_string_lossy().into_owned())
        .collect();

    names.sort_by_key(|name| name.to_lowercase());
    names.dedup_by(|a, b| a.eq_ignore_ascii_case(b));

    Ok(names)
}

#[tauri::command]
pub fn get_mappings() -> Result<Vec<ProcessMapping>> {
    let cfg = config::create_or_load_config()?;
    Ok(cfg.mappings)
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn add_mapping(processName: String, profileId: Uuid) -> Result<()> {
    let mut cfg = config::create_or_load_config()?;
    cfg.mappings.push(ProcessMapping {
        id: Uuid::new_v4(),
        process_name: processName,
        profile_id: profileId,
    });
    config::save_config(cfg)
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn update_mapping(mappingId: Uuid, processName: String, profileId: Uuid) -> Result<()> {
    let mut cfg = config::create_or_load_config()?;
    let mapping = cfg
        .mappings
        .iter_mut()
        .find(|m| m.id == mappingId)
        .ok_or(Error::ProfileNotFound)?;
    mapping.process_name = processName;
    mapping.profile_id = profileId;
    config::save_config(cfg)
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn delete_mapping(mappingId: Uuid) -> Result<()> {
    let mut cfg = config::create_or_load_config()?;
    cfg.mappings.retain(|m| m.id != mappingId);
    config::save_config(cfg)
}
