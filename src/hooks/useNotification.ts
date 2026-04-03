import {useStore} from "../store/useStore";

interface NotificationState {
    showNotification: boolean;
    playSound: boolean;
}

export function useNotification(): NotificationState {
    const settings = useStore((state) => state.settings);

    return {
        showNotification: settings?.show_notification ?? true,
        playSound: settings?.play_sound ?? true,
    };
}
