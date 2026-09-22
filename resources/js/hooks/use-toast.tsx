import * as React from 'react';

interface Toast {
    id: number;
    message: string;
    variant: 'success' | 'error';
}

interface ToastContextValue {
    toasts: Toast[];
    push: (message: string, variant?: Toast['variant']) => void;
    dismiss: (id: number) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const dismiss = React.useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = React.useCallback(
        (message: string, variant: Toast['variant'] = 'success') => {
            const id = nextId++;
            setToasts((prev) => [...prev, { id, message, variant }]);
            window.setTimeout(() => dismiss(id), 4000);
        },
        [dismiss],
    );

    return (
        <ToastContext.Provider value={{ toasts, push, dismiss }}>
            {children}
            <div className="admin-toast-viewport" role="status" aria-live="polite">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`admin-toast admin-toast-${t.variant}`}
                        role="alert"
                        onClick={() => dismiss(t.id)}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = React.useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
