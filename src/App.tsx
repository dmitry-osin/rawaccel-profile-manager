import {useEffect, useState} from "react";
import {listen} from "@tauri-apps/api/event";
import {BlockerOverlay} from "./components/Layout/BlockerOverlay";
import {Sidebar, type View} from "./components/Layout/Sidebar";
import {StatusBar} from "./components/Layout/StatusBar";
import {TitleBar} from "./components/Layout/TitleBar";
import {Wizard} from "./components/Wizard/Wizard";
import {ErrorModal} from "./components/Modals/ErrorModal";
import {ProfilesView} from "./views/ProfilesView";
import {AutoSwitchView} from "./views/AutoSwitchView";
import {SettingsView} from "./views/SettingsView";
import {AboutView} from "./views/AboutView";
import {useConfig} from "./hooks/useConfig";
import {useProfiles} from "./hooks/useProfiles";
import {useProcessWatcher} from "./hooks/useProcessWatcher";
import {useTheme} from "./hooks/useTheme";
import {useErrorModal} from "./hooks/useErrorModal";
import {useStore} from "./store/useStore";
import {initKeyboardBlocker} from "./utils/keyboardBlocker";
import {cancelRawaccelOperation} from "./api/tauri";

function formatError(err: unknown): string {
    if (err instanceof Error) return err.message;
    return String(err);
}

function App() {
    const [currentView, setCurrentView] = useState<View>("profiles");
    const [isRawAccelOpen, setIsRawAccelOpen] = useState(false);
    const {error, showError, closeError} = useErrorModal("Unexpected Error");

    const {config, loading: configLoading, load: reloadConfig} = useConfig();
    const {loading: profilesLoading} = useProfiles();
    const {loading: mappingsLoading} = useProcessWatcher();
    const setActiveProfileId = useStore((state) => state.setActiveProfileId);

    useTheme();

    useEffect(() => {
        let unlisten: (() => void) | undefined;

        listen<{ profile_id: string; profile_name: string }>(
            "profile:switched",
            (event) => {
                setActiveProfileId(event.payload.profile_id);
            }
        ).then((cleanup) => {
            unlisten = cleanup;
        });

        return () => {
            unlisten?.();
        };
    }, [setActiveProfileId]);

    useEffect(() => {
        if (!config) return;
        return initKeyboardBlocker(config.debug_mode);
    }, [config?.debug_mode]);

    useEffect(() => {
        const onError = (event: ErrorEvent) => {
            showError(formatError(event.error), "Unexpected Error");
        };
        const onRejection = (event: PromiseRejectionEvent) => {
            showError(formatError(event.reason), "Unexpected Error");
            event.preventDefault();
        };

        window.addEventListener("error", onError);
        window.addEventListener("unhandledrejection", onRejection);
        return () => {
            window.removeEventListener("error", onError);
            window.removeEventListener("unhandledrejection", onRejection);
        };
    }, [showError]);

    const handleWizardComplete = () => {
        void reloadConfig();
    };

    const handleCancelOperation = async () => {
        try {
            await cancelRawaccelOperation();
        } catch (err) {
            console.error("Failed to cancel RawAccel operation:", err);
        } finally {
            setIsRawAccelOpen(false);
        }
    };

    const isLoading = configLoading || profilesLoading || mappingsLoading;

    if (isLoading) {
        return (
            <div
                className="h-screen w-screen flex
                items-center justify-center
                bg-[var(--md-sys-color-background)]
                text-[var(--md-sys-color-on-surface)]">
                Loading…
            </div>
        );
    }

    return (
        <div
            className="flex flex-col h-screen
            w-screen overflow-hidden
            bg-[var(--md-sys-color-background)]
            text-[var(--md-sys-color-on-background)]">
            <TitleBar/>

            <div className="flex flex-1 overflow-hidden">
                <Sidebar active={currentView} onChange={setCurrentView}/>

                <main className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 p-6 overflow-auto custom-scrollbar">
                        {currentView === "profiles" ? (
                            <ProfilesView setIsRawAccelOpen={setIsRawAccelOpen}/>
                        ) : currentView === "auto-switch" ? (
                            <AutoSwitchView/>
                        ) : currentView === "settings" ? (
                            <SettingsView/>
                        ) : currentView === "about" ? (
                            <AboutView/>
                        ) : (
                            <PlaceholderView view={currentView}/>
                        )}
                    </div>
                </main>
            </div>

            <StatusBar/>

            {isRawAccelOpen && <BlockerOverlay onCancel={handleCancelOperation}/>}
            {config && !config.wizard_shown && (
                <Wizard onComplete={handleWizardComplete}/>
            )}

            <ErrorModal
                isOpen={error.open}
                title={error.title}
                message={error.message}
                onClose={closeError}
            />
        </div>
    );
}

function PlaceholderView({view}: { view: View }) {
    const titles: Record<View, string> = {
        profiles: "Profiles",
        "auto-switch": "Auto-Switch",
        settings: "Settings",
        about: "About",
    };

    return (
        <div className="h-full flex flex-col
        items-center justify-center
        text-[var(--md-sys-color-on-surface-variant)]">
            <h1 className="text-2xl font-bold
            text-[var(--md-sys-color-on-surface)]">
                {titles[view]}
            </h1>
            <p className="mt-2">Content will be implemented in the next stages.</p>
        </div>
    );
}

export default App;
