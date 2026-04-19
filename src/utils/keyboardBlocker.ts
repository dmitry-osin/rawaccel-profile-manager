export function initKeyboardBlocker(debugMode: boolean): () => void {
    if (debugMode) {
        return () => {
        };
    }
    const blockKey = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase();

        const isF5 = key === "f5";
        const isF12 = key === "f12";
        const isCtrlR = event.ctrlKey && key === "r";
        const isCtrlShiftI = event.ctrlKey && event.shiftKey && key === "i";
        const isCtrlShiftJ = event.ctrlKey && event.shiftKey && key === "j";
        const isCtrlU = event.ctrlKey && key === "u";
        const isCtrlS = event.ctrlKey && key === "s";

        if (
            isF5 ||
            isF12 ||
            isCtrlR ||
            isCtrlShiftI ||
            isCtrlShiftJ ||
            isCtrlU ||
            isCtrlS
        ) {
            event.preventDefault();
        }
    };

    const blockContextMenu = (event: MouseEvent) => {
        event.preventDefault();
    };

    window.addEventListener("keydown", blockKey);
    window.addEventListener("contextmenu", blockContextMenu);

    return () => {
        window.removeEventListener("keydown", blockKey);
        window.removeEventListener("contextmenu", blockContextMenu);
    };
}
