export interface ProcessMapping {
  id: string;
  process_name: string;
  profile_id: string;
}

export interface AppConfig {
  rawaccel_path: string;
  process_check_delay_ms: number;
  auto_switch_enabled: boolean;
  theme: "light" | "dark" | "neon";
  wizard_shown: boolean;
  start_with_windows: boolean;
  close_to_tray: boolean;
  minimize_to_tray: boolean;
  start_minimized: boolean;
  show_notification: boolean;
  play_sound: boolean;
  debug_mode: boolean;
  log_level: string;
  hotkeys: Record<string, string>;
  language: string;
  active_profile_id: string | null;
  mappings: ProcessMapping[];
}

export interface Profile {
  id: string;
  name: string;
  is_default: boolean;
  bound_processes: string[];
  settings_json: unknown;
}
