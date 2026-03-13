use tauri::AppHandle;

pub fn init_hotkeys(_app: &AppHandle) -> crate::error::Result<()> {
    Ok(())
}

// Tauri hotkey commands

#[tauri::command]
pub fn update_hotkeys() -> crate::error::Result<()> {
    Ok(())
}
