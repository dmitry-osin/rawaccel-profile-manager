import {useEffect} from "react";
import {Wizard} from "./components/Wizard/Wizard";
import {useConfig} from "./hooks/useConfig";
import {useTheme} from "./hooks/useTheme";
import {initKeyboardBlocker} from "./utils/keyboardBlocker";

function App() {

    const {config, loading: _, load: reloadConfig} = useConfig();
    useTheme();
    useEffect(() => {
        if (!config) return;
        return initKeyboardBlocker(config.debug_mode);
    }, [config?.debug_mode]);

    const handleWizardComplete = () => {
        void reloadConfig();
    };

    return (
        <div
            className="flex flex-col h-screen w-screen
            overflow-hidden bg-[var(--md-sys-color-background)]
            text-[var(--md-sys-color-on-background)]">
            <Wizard onComplete={handleWizardComplete}/>
        </div>
    );
}

export default App;
