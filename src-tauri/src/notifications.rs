use std::sync::OnceLock;

use tauri::{AppHandle, Emitter};
use tauri_plugin_notification::NotificationExt;
use uuid::Uuid;

use crate::config;

static APP_HANDLE: OnceLock<AppHandle> = OnceLock::new();
pub fn init(app: &AppHandle) {
    let _ = APP_HANDLE.set(app.clone());
}

#[derive(Clone, serde::Serialize)]
struct ProfileSwitchedPayload {
    profile_id: String,
    profile_name: String,
}

pub fn notify_profile_switch(profile_name: &str) {
    let Some(app) = APP_HANDLE.get() else {
        eprintln!("notification: app handle not initialized");
        return;
    };

    let Ok(cfg) = config::create_or_load_config() else {
        return;
    };

    if !cfg.show_notification && !cfg.play_sound {
        return;
    }

    let mut builder = app
        .notification()
        .builder()
        .title("RawAccel Profile Manager")
        .body(format!("Switched to {profile_name}"));

    if cfg.play_sound {
        builder = builder.sound("Default");
    }

    if let Err(err) = builder.show() {
        eprintln!("failed to show notification: {err}");
    }
}

pub fn emit_profile_switched(profile_id: Uuid, profile_name: &str) {
    let Some(app) = APP_HANDLE.get() else {
        return;
    };

    let payload = ProfileSwitchedPayload {
        profile_id: profile_id.to_string(),
        profile_name: profile_name.to_string(),
    };

    if let Err(err) = app.emit("profile:switched", payload) {
        eprintln!("failed to emit profile:switched event: {err}");
    }
}
