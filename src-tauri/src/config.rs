use crate::error::Error;
use crate::error::Result;
use crate::APPLICATION_NAME;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessMapping {
    pub id: Uuid,
    pub process_name: String,
    pub profile_id: Uuid,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    #[serde(default)]
    pub rawaccel_path: String,

    #[serde(default = "default_delay")]
    pub process_check_delay_ms: u64,

    #[serde(default = "default_auto_switch")]
    pub auto_switch_enabled: bool,

    #[serde(default = "default_theme")]
    pub theme: String,

    #[serde(default)]
    pub wizard_shown: bool,

    #[serde(default)]
    pub start_with_windows: bool,

    #[serde(default = "default_true")]
    pub close_to_tray: bool,

    #[serde(default = "default_true")]
    pub minimize_to_tray: bool,

    #[serde(default)]
    pub start_minimized: bool,

    #[serde(default = "default_true")]
    pub show_notification: bool,

    #[serde(default = "default_true")]
    pub play_sound: bool,

    #[serde(default)]
    pub debug_mode: bool,

    #[serde(default = "default_log_level")]
    pub log_level: String,

    #[serde(default)]
    pub hotkeys: HashMap<String, String>,

    #[serde(default = "default_language")]
    pub language: String,

    #[serde(default)]
    pub active_profile_id: Option<Uuid>,

    #[serde(default)]
    pub mappings: Vec<ProcessMapping>,
}

fn default_delay() -> u64 {
    1000
}

fn default_auto_switch() -> bool {
    true
}

fn default_theme() -> String {
    "dark".to_string()
}

fn default_true() -> bool {
    true
}

fn default_log_level() -> String {
    "info".to_string()
}

fn default_language() -> String {
    "en".to_string()
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            rawaccel_path: String::new(),
            process_check_delay_ms: 1000,
            auto_switch_enabled: true,
            theme: default_theme(),
            wizard_shown: false,
            start_with_windows: false,
            close_to_tray: true,
            minimize_to_tray: true,
            start_minimized: false,
            show_notification: true,
            play_sound: true,
            debug_mode: false,
            log_level: default_log_level(),
            hotkeys: HashMap::new(),
            language: default_language(),
            active_profile_id: None,
            mappings: Vec::new(),
        }
    }
}

pub fn get_app_data_dir() -> Result<PathBuf> {
    std::env::var_os("APPDATA")
        .map(PathBuf::from)
        .or_else(dirs::data_dir)
        .map(|dir| dir.join(APPLICATION_NAME))
        .ok_or(Error::ConfigDirNotFound)
}

pub fn create_data_dir() -> Result<()> {
    fs::create_dir_all(get_app_data_dir()?)?;
    Ok(())
}

pub fn load_config() -> Result<AppConfig> {
    let path = config_path()?;
    if !path.is_file() {
        return Ok(AppConfig::default());
    }

    let content = fs::read_to_string(&path)?;
    serde_json::from_str(&content).map_err(Error::from)
}

pub fn create_or_load_config() -> Result<AppConfig> {
    let path = config_path()?;
    if !path.is_file() {
        let default = AppConfig::default();
        save_config(default.clone())?;
        return Ok(default);
    }

    load_config()
}

pub fn save_config(config: AppConfig) -> Result<()> {
    create_data_dir()?;
    let path = config_path()?;
    let content = serde_json::to_string_pretty(&config)?;
    fs::write(&path, content)?;
    Ok(())
}

pub fn validate_rawaccel_path(path: &str) -> Result<()> {
    let dir = Path::new(path);
    let rawaccel = dir.join("rawaccel.exe");
    let writer = dir.join("writer.exe");
    let installer = dir.join("installer.exe");

    if !rawaccel.is_file() || !writer.is_file() || !installer.is_file() {
        return Err(Error::InvalidRawAccelPath(format!(
            "directory '{}' must contains rawaccel.exe, writer.exe and installer.exe",
            path
        )));
    }

    Ok(())
}

fn open_folder(path: &Path) -> Result<()> {
    Command::new("explorer")
        .arg(path.as_os_str())
        .spawn()
        .map(|_| ())?;
    Ok(())
}

fn config_path() -> Result<PathBuf> {
    Ok(get_app_data_dir()?.join("config.json"))
}

// Tauri config commands

#[tauri::command]
pub fn get_config() -> Result<AppConfig> {
    create_or_load_config()
}

#[tauri::command]
pub fn set_config(config: AppConfig) -> Result<()> {
    save_config(config)
}

#[tauri::command]
pub fn set_rawaccel_path(path: String) -> Result<()> {
    validate_rawaccel_path(&path)?;

    let mut config = create_or_load_config()?;
    config.rawaccel_path = path;
    save_config(config)
}

#[tauri::command]
pub fn open_app_folder() -> Result<()> {
    let dir = get_app_data_dir()?;
    create_data_dir()?;
    open_folder(&dir)
}

#[tauri::command]
pub fn open_rawaccel_folder() -> Result<()> {
    let config = create_or_load_config()?;
    let dir = PathBuf::from(&config.rawaccel_path);

    if !dir.is_dir() {
        return Err(Error::InvalidRawAccelPath(format!(
            "rawaccel path '{}' is not a directory",
            config.rawaccel_path
        )));
    }

    open_folder(&dir)
}

#[tauri::command]
pub fn run_wizard() -> Result<()> {
    let mut config = create_or_load_config()?;
    config.wizard_shown = false;
    save_config(config)
}

#[tauri::command]
pub fn is_admin() -> bool {
    is_elevated::is_elevated()
}

#[tauri::command]
pub fn export_settings(path: String) -> Result<()> {
    let source = config_path()?;
    if !source.is_file() {
        return Err(Error::ConfigNotFound);
    }
    fs::copy(&source, &path)?;
    Ok(())
}

#[tauri::command]
pub fn import_settings(path: String) -> Result<AppConfig> {
    let content = fs::read_to_string(&path)?;
    let config: AppConfig = serde_json::from_str(&content)?;
    save_config(config.clone())?;
    Ok(config)
}

#[tauri::command]
pub fn restart_as_admin() -> Result<()> {
    #[cfg(target_os = "windows")]
    {
        let exe = std::env::current_exe()?;
        let script = format!(
            "Start-Process -FilePath '{}' -Verb runAs",
            exe.to_string_lossy()
        );

        Command::new("powershell")
            .arg("-Command")
            .arg(&script)
            .spawn()?;

        std::process::exit(0);
    }

    #[cfg(not(target_os = "windows"))]
    {
        Err(Error::Io(
            "elevation restart is only supported on Windows".to_string(),
        ))
    }
}
