use tauri::menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::tray::{TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Manager, Runtime};
use uuid::Uuid;

use crate::autostart;
use crate::config;
use crate::error::Result;
use crate::profile;

const TRAY_ID: &str = "main-tray";
const MENU_SHOW: &str = "show";
const MENU_EXIT: &str = "exit";
const MENU_TOGGLE_AUTO: &str = "toggle_auto";
const MENU_NO_PROFILES: &str = "no_profiles";

pub fn create_tray<R: Runtime>(app: &AppHandle<R>) -> Result<()> {
    let menu = build_menu(app)?;

    TrayIconBuilder::with_id(TRAY_ID)
        .icon(
            app.default_window_icon()
                .cloned()
                .ok_or_else(|| crate::error::Error::Io("no window icon found".to_string()))?,
        )
        .menu(&menu)
        .show_menu_on_left_click(true)
        .on_menu_event(|app, event| handle_menu_event(app, event))
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::DoubleClick { .. } = event {
                if let Err(err) = show_main_window(tray.app_handle()) {
                    eprintln!("tray: failed to show window: {err}");
                }
            }
        })
        .build(app)?;

    Ok(())
}

fn build_menu<R: Runtime>(app: &AppHandle<R>) -> Result<tauri::menu::Menu<R>> {
    let cfg = config::create_or_load_config()?;

    let show_item = MenuItemBuilder::new("Show").id(MENU_SHOW).build(app)?;
    let profiles_submenu = build_profiles_submenu(app)?;

    let auto_text = if cfg.auto_switch_enabled {
        "Auto-Switch: ON"
    } else {
        "Auto-Switch: OFF"
    };
    let auto_item = MenuItemBuilder::new(auto_text)
        .id(MENU_TOGGLE_AUTO)
        .build(app)?;

    let exit_item = MenuItemBuilder::new("Exit").id(MENU_EXIT).build(app)?;

    let menu = MenuBuilder::new(app)
        .item(&show_item)
        .item(&profiles_submenu)
        .item(&auto_item)
        .item(&exit_item)
        .build()?;

    Ok(menu)
}

fn build_profiles_submenu<R: Runtime>(app: &AppHandle<R>) -> Result<tauri::menu::Submenu<R>> {
    let profiles = profile::get_profiles().unwrap_or_default();
    let mut builder = SubmenuBuilder::new(app, "Profiles");

    if profiles.is_empty() {
        let item = MenuItemBuilder::new("(no profiles)")
            .id(MENU_NO_PROFILES)
            .enabled(false)
            .build(app)?;
        builder = builder.item(&item);
    } else {
        for profile in profiles {
            let prefix = if profile.is_default { "★ " } else { "" };
            let text = format!("{}{}", prefix, profile.name);
            let item = MenuItemBuilder::new(text)
                .id(profile.id.to_string())
                .build(app)?;
            builder = builder.item(&item);
        }
    }

    Ok(builder.build()?)
}

fn handle_menu_event<R: Runtime>(app: &AppHandle<R>, event: tauri::menu::MenuEvent) {
    let result = match event.id.as_ref() {
        MENU_SHOW => show_main_window(app),
        MENU_EXIT => {
            app.exit(0);
            Ok(())
        }
        MENU_TOGGLE_AUTO => toggle_auto_switch(app),
        id => {
            if let Ok(profile_id) = Uuid::parse_str(id) {
                profile::apply_profile_sync(profile_id)
            } else {
                Ok(())
            }
        }
    };

    if let Err(err) = result {
        eprintln!("tray menu event error: {err}");
    }
}

fn show_main_window<R: Runtime>(app: &AppHandle<R>) -> Result<()> {
    if let Some(window) = app.get_webview_window("main") {
        window.show()?;
        window.set_focus()?;
    }
    Ok(())
}

fn toggle_auto_switch<R: Runtime>(app: &AppHandle<R>) -> Result<()> {
    let mut cfg = config::create_or_load_config()?;
    cfg.auto_switch_enabled = !cfg.auto_switch_enabled;
    config::save_config(cfg)?;

    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        let menu = build_menu(app)?;
        tray.set_menu(Some(menu))?;
    }

    Ok(())
}

#[expect(dead_code)]
pub fn refresh_profiles_menu<R: Runtime>(app: &AppHandle<R>) -> Result<()> {
    if let Some(tray) = app.tray_by_id(TRAY_ID) {
        let menu = build_menu(app)?;
        tray.set_menu(Some(menu))?;
    }
    Ok(())
}

// Tauri tray commands

#[tauri::command]
pub fn get_autostart() -> Result<bool> {
    autostart::is_autostart_enabled()
}
