import {useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import type {AppConfig} from "../../types";
import {Button} from "../ui/Button";
import {DownloadStep} from "./steps/DownloadStep";
import {FinishStep} from "./steps/FinishStep";
import {InstallStep} from "./steps/InstallStep";
import {PathStep} from "./steps/PathStep";
import {WelcomeStep} from "./steps/WelcomeStep";

interface WizardProps {
    onComplete: () => void;
}

const STEP_COMPONENTS = [
    WelcomeStep,
    DownloadStep,
    InstallStep,
    FinishStep,
];

const STEP_COUNT = STEP_COMPONENTS.length + 1;

export function Wizard({onComplete}: WizardProps) {
    const [step, setStep] = useState(0);
    const [rawaccelPath, setRawaccelPath] = useState("");
    const [pathValid, setPathValid] = useState(false);

    const handlePathChange = (path: string, valid: boolean) => {
        setRawaccelPath(path);
        setPathValid(valid);
    };

    const handleNext = async () => {
        if (step === STEP_COUNT - 1) {
            await finish();
        } else {
            setStep((s) => s + 1);
        }
    };

    const finish = async () => {
        try {
            const cfg = await invoke<AppConfig>("get_config");
            await invoke("set_config", {
                config: {...cfg, wizard_shown: true},
            });
            onComplete();
        } catch (err) {
            console.error("Failed to complete wizard:", err);
        }
    };

    const canGoNext = step !== 3 || pathValid;
    const showBack = step > 0 && step < STEP_COUNT - 1;

    const renderStep = () => {
        switch (step) {
            case 0:
                return <WelcomeStep/>;
            case 1:
                return <DownloadStep/>;
            case 2:
                return <InstallStep/>;
            case 3:
                return <PathStep path={rawaccelPath} onPathChange={handlePathChange}/>;
            case 4:
                return <FinishStep/>;
            default:
                return null;
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
            bg-[var(--md-sys-color-scrim)]/60 backdrop-blur-sm">
            <div
                className="w-full max-w-lg rounded-2xl
                bg-[var(--md-sys-color-surface)]
                text-[var(--md-sys-color-on-surface)]
                border border-[var(--md-sys-color-outline-variant)] shadow-xl p-6">
                <div className="flex gap-1 mb-6">
                    {Array.from({length: STEP_COUNT}).map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                                index <= step
                                    ? "bg-[var(--md-sys-color-primary)]"
                                    : "bg-[var(--md-sys-color-outline-variant)]"
                            }`}
                        />
                    ))}
                </div>

                <div className="min-h-[220px] flex items-center justify-center">
                    {renderStep()}
                </div>

                <div className="flex justify-between items-center mt-8">
                    <div className="flex gap-2">
                        {showBack && (
                            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                                Back
                            </Button>
                        )}
                    </div>

                    <Button onClick={handleNext} disabled={!canGoNext}>
                        {step === STEP_COUNT - 1 ? "Finish" : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
