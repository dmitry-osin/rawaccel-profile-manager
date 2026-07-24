use std::ffi::OsStr;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};

use serde_json::Value;
use sysinfo::{ProcessRefreshKind, RefreshKind, System};
use tokio::process::{Child, Command as TokioCommand};

use crate::config;
use crate::error::{Error, Result};

const RAWACCEL_EXE: &str = "rawaccel.exe";
const WRITER_EXE: &str = "writer.exe";
const SETTINGS_FILE: &str = "settings.json";
const BACKUP_FILE: &str = "settings.json.bak";
const DEFAULT_SETTINGS: &str = include_str!("../default_settings.json");

pub fn get_rawaccel_dir() -> Result<PathBuf> {
    let cfg = config::create_or_load_config()?;
    if cfg.rawaccel_path.is_empty() {
        return Err(Error::InvalidRawAccelPath(
            "rawaccel path is not configured".to_string(),
        ));
    }

    config::validate_rawaccel_path(&cfg.rawaccel_path)?;
    Ok(PathBuf::from(cfg.rawaccel_path))
}

pub fn backup_settings() -> Result<()> {
    let source = get_settings_path()?;
    let backup = get_backup_path()?;

    // Remove old backup file
    if backup.is_file() {
        fs::remove_file(&source)?;
    }

    if source.is_file() {
        fs::copy(&source, backup)?;
    }
    Ok(())
}

pub fn restore_settings() -> Result<()> {
    let backup = get_backup_path()?;
    if backup.is_file() {
        fs::copy(&backup, get_settings_path()?)?;
    }
    Ok(())
}

pub fn read_settings() -> Result<Value> {
    let path = get_settings_path()?;
    let content = fs::read_to_string(&path)?;
    serde_json::from_str(&content).map_err(Error::from)
}

pub fn write_settings(value: &Value) -> Result<()> {
    let path = get_settings_path()?;
    let content = serde_json::to_string_pretty(value)?;
    fs::write(&path, content)?;
    Ok(())
}

pub fn remove_settings() -> Result<()> {
    let path = get_settings_path()?;
    if path.is_file() {
        fs::remove_file(&path)?;
    }
    Ok(())
}

pub fn default_settings() -> Value {
    serde_json::from_str(DEFAULT_SETTINGS).expect("default settings JSON is valid")
}

pub fn write_default_settings() -> Result<()> {
    write_settings(&default_settings())
}

fn refreshed_system() -> System {
    System::new_with_specifics(
        RefreshKind::nothing().with_processes(ProcessRefreshKind::everything()),
    )
}

pub fn is_rawaccel_running() -> bool {
    let system = refreshed_system();
    let mut processes = system.processes_by_name(OsStr::new(RAWACCEL_EXE));
    processes.next().is_some()
}

pub fn stop_rawaccel_process() -> Result<()> {
    let system = refreshed_system();
    let mut done = false;

    for process in system.processes_by_name(OsStr::new(RAWACCEL_EXE)) {
        if !process.kill() {
            return Err(Error::Io(format!(
                "failed to stop rawaccel process {}",
                process.pid()
            )));
        }
        done = true;
    }

    if !done {
        return Err(Error::Io("rawaccel.exe is not running".to_string()));
    }

    // Wait until stop
    for _ in 0..50 {
        if !is_rawaccel_running() {
            return Ok(());
        }
        std::thread::sleep(std::time::Duration::from_millis(100));
    }

    Err(Error::Io(
        "rawaccel.exe did not exit after kill".to_string(),
    ))
}

pub fn run_rawaccel_process() -> Result<Child> {
    let exe = get_rawaccel_exe_path()?;
    let dir = get_rawaccel_dir()?;

    TokioCommand::new(&exe)
        .current_dir(&dir)
        .stdin(Stdio::null())
        .spawn()
        .map_err(Error::from)
}

pub async fn wait_rawaccel_process(mut child: Child) -> Result<()> {
    child.wait().await.map(|_| ()).map_err(Error::from)
}

pub fn apply_profile_settings(profile_settings_path: &Path) -> Result<()> {
    let writer = get_writer_exe_path()?;
    let dir = get_rawaccel_dir()?;

    let output = Command::new(&writer)
        .current_dir(&dir)
        .arg(profile_settings_path)
        .output()?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(Error::Io(format!("writer.exe failed: {stderr}")));
    }

    let settings = read_settings_from_path(profile_settings_path)?;
    write_settings(&settings)?;

    Ok(())
}

fn get_rawaccel_exe_path() -> Result<PathBuf> {
    Ok(get_rawaccel_dir()?.join(RAWACCEL_EXE))
}

fn get_writer_exe_path() -> Result<PathBuf> {
    Ok(get_rawaccel_dir()?.join(WRITER_EXE))
}

pub fn get_settings_path() -> Result<PathBuf> {
    Ok(get_rawaccel_dir()?.join(SETTINGS_FILE))
}

fn get_backup_path() -> Result<PathBuf> {
    Ok(get_rawaccel_dir()?.join(BACKUP_FILE))
}

fn read_settings_from_path(path: &Path) -> Result<Value> {
    let content = fs::read_to_string(path)?;
    serde_json::from_str(&content).map_err(Error::from)
}

// Tauri RawAccel commands

#[tauri::command]
pub fn cancel_rawaccel_operation() -> Result<()> {
    if is_rawaccel_running() {
        stop_rawaccel_process()?;
    }
    restore_settings()
}
