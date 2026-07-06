import {useConfig} from "../hooks/useConfig";
import {useProfiles} from "../hooks/useProfiles";
import {AppearanceSettings} from "../components/Settings/AppearanceSettings";
import {GeneralSettings} from "../components/Settings/GeneralSettings";
import {NotificationSettings} from "../components/Settings/NotificationSettings";
import {RawAccelSettings} from "../components/Settings/RawAccelSettings";
import {DeveloperSettings} from "../components/Settings/DeveloperSettings";
import {DataManagement} from "../components/Settings/DataManagement";

export function SettingsView() {
    const {config, autostart, loading, updateConfig, setAutostartEnabled} =
        useConfig();
    const {profiles, load: loadProfiles} = useProfiles();

    if (loading || !config) {
        return (
            <div className="text-center py-12
            text-[var(--md-sys-color-on-surface-variant)]">
                Loading settings…
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            <header>
                <h1 className="text-2xl font-bold
                text-[var(--md-sys-color-on-surface)]">
                    Settings
                </h1>
                <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                    Configure application behavior and preferences
                </p>
            </header>

            <AppearanceSettings
                theme={config.theme}
                onChange={(theme) => updateConfig({theme})}
            />

            <GeneralSettings
                autostart={autostart}
                startMinimized={config.start_minimized}
                closeToTray={config.close_to_tray}
                minimizeToTray={config.minimize_to_tray}
                onAutostartChange={setAutostartEnabled}
                onChange={updateConfig}
            />

            <NotificationSettings
                showNotification={config.show_notification}
                playSound={config.play_sound}
                onChange={updateConfig}
            />

            <RawAccelSettings
                rawaccelPath={config.rawaccel_path}
                onPathChange={(rawaccel_path) => updateConfig({rawaccel_path})}
                onRunWizard={() => updateConfig({wizard_shown: false})}
            />

            <DataManagement
                profiles={profiles}
                onSettingsImported={() => {
                    window.location.reload();
                }}
                onProfilesImported={() => loadProfiles()}
            />

            <DeveloperSettings
                debugMode={config.debug_mode}
                logLevel={config.log_level}
                onChange={updateConfig}
            />
        </div>
    );
}
