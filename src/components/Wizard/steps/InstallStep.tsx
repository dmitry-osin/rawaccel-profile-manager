export function InstallStep() {
    return (
        <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-[var(--md-sys-color-on-surface)]">
                Install RawAccel
            </h2>
            <ol className="text-left text-[var(--md-sys-color-on-surface-variant)]
            space-y-2 list-decimal list-inside">
                <li>Extract the downloaded archive.</li>
                <li>Run installer.exe and follow the instructions.</li>
            </ol>
        </div>
    );
}
