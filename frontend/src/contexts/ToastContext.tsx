import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastType } from '../components/Toast';

interface ToastContextType {
    showToast: (_message: string, _type: ToastType, _duration?: number) => void;
    hideToast: (_id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    duration: number;
    isVisible: boolean;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, type: ToastType, duration: number = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: ToastItem = {
            id,
            message,
            type,
            duration,
            isVisible: true,
        };

        setToasts(prev => [...prev, newToast]);
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
                {toasts.map((toast, index) => (
                    <div key={toast.id} style={{ top: `${index * 80 + 16}px` }} className="absolute right-4">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            isVisible={toast.isVisible}
                            onClose={() => hideToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}; 