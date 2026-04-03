import {useCallback, useState} from "react";

export interface ErrorState {
    open: boolean;
    title: string;
    message: string;
}

export function useErrorModal(defaultTitle = "Error") {
    const [error, setError] = useState<ErrorState>({
        open: false,
        title: defaultTitle,
        message: "",
    });

    const showError = useCallback(
        (message: string, title?: string) => {
            setError({
                open: true,
                title: title ?? defaultTitle,
                message,
            });
        },
        [defaultTitle]
    );

    const closeError = useCallback(() => {
        setError((prev) => ({...prev, open: false}));
    }, []);

    return {
        error,
        showError,
        closeError,
    };
}
