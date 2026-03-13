use std::path::PathBuf;

use winreg::enums::HKEY_CURRENT_USER;
use winreg::RegKey;

use crate::error::{Error, Result};

const RUN_KEY: &str = r"Software\Microsoft\Windows\CurrentVersion\Run";
const APP_KEY_NAME: &str = "RawAccelProfileManager";

fn get_current_exe_path() -> Result<PathBuf> {
    std::env::current_exe().map_err(Error::from)
}

// Tauri autostart commands

#[tauri::command]
pub fn set_autostart(enabled: bool) -> Result<()> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let (run, _) = hkcu.create_subkey(RUN_KEY)?;

    if enabled {
        let path = get_current_exe_path()?;
        run.set_value(APP_KEY_NAME, &path.to_string_lossy().to_string())?;
    } else {
        run.delete_value(APP_KEY_NAME)?;
    }

    Ok(())
}

#[tauri::command]
pub fn is_autostart_enabled() -> Result<bool> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let run = hkcu.open_subkey(RUN_KEY)?;
    let value: std::result::Result<String, _> = run.get_value(APP_KEY_NAME);
    Ok(value.is_ok())
}
