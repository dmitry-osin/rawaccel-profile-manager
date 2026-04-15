import {useEffect} from "react";
import {useStore} from "../store/useStore";

export function useTheme() {
    const theme = useStore((state) => state.settings?.theme ?? "dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return theme;
}
