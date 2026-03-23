mod autostart;
mod config;
mod error;
mod hotkey;
mod notifications;
mod profile;
mod rawaccel;
mod tray;
mod watcher;

use tauri::Manager;

const APPLICATION_NAME: &str = "RawAccelProfileManager";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let result = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            notifications::init(app.handle());

            if let Err(err) = tray::create_tray(app.handle()) {
                eprintln!("failed to create tray: {err}");
            }

            if let Err(err) = hotkey::init_hotkeys(app.handle()) {
                eprintln!("failed to init hotkeys: {err}");
            }

            watcher::start();

            apply_window_behavior(app);
            Ok(())
        })
        .on_window_event(handle_window_event)
        .invoke_handler(tauri::generate_handler![
            config::get_config,
            config::set_config,
            config::set_rawaccel_path,
            config::open_app_folder,
            config::open_rawaccel_folder,
            config::run_wizard,
            config::is_admin,
            config::restart_as_admin,
            config::export_settings,
            config::import_settings,
            autostart::set_autostart,
            tray::get_autostart,
            hotkey::update_hotkeys,
            rawaccel::cancel_rawaccel_operation,
            watcher::get_running_processes,
            watcher::get_mappings,
            watcher::add_mapping,
            watcher::update_mapping,
            watcher::delete_mapping,
            profile::create_profile,
            profile::edit_profile,
            profile::rename_profile,
            profile::duplicate_profile,
            profile::delete_profile,
            profile::apply_profile,
            profile::set_default_profile,
            profile::get_profiles_command,
            profile::get_active_profile_command,
            profile::export_profile,
            profile::import_profile,
        ])
        .run(tauri::generate_context!());

    if let Err(err) = result {
        eprintln!("error while running tauri application: {err}");
        std::process::exit(1);
    }
}

fn apply_window_behavior(app: &tauri::App) {
    if let Ok(cfg) = config::create_or_load_config() {
        if cfg.start_minimized {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.hide();
            }
        }
    }
}

fn handle_window_event(window: &tauri::Window, event: &tauri::WindowEvent) {
    let Ok(cfg) = config::create_or_load_config() else {
        return;
    };

    match event {
        tauri::WindowEvent::CloseRequested { api, .. } if cfg.close_to_tray => {
            api.prevent_close();
            let _ = window.hide();
        }
        tauri::WindowEvent::Resized(_)
            if cfg.minimize_to_tray && window.is_minimized().unwrap_or(false) =>
        {
            let _ = window.hide();
        }
        _ => {}
    }
}
