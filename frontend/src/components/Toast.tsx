import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
    isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ 
    message, 
    type, 
    duration = 5000, 
    onClose, 
    isVisible 
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setTimeout(onClose, 300); // Wait for animation to complete
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const getToastStyles = () => {
        const baseStyles = "fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out";
        
        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-500 border-l-4 border-green-600`;
            case 'error':
                return `${baseStyles} bg-red-500 border-l-4 border-red-600`;
            case 'warning':
                return `${baseStyles} bg-yellow-500 border-l-4 border-yellow-600`;
            case 'info':
                return `${baseStyles} bg-blue-500 border-l-4 border-blue-600`;
            default:
                return `${baseStyles} bg-gray-500 border-l-4 border-gray-600`;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '💬';
        }
    };

    if (!isVisible) return null;

    return (
        <div 
            className={`${getToastStyles()} ${
                isAnimating 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-full opacity-0'
            }`}
        >
            <div className="flex items-center p-4 text-white shadow-lg">
                <div className="flex-shrink-0 mr-3">
                    <span className="text-xl">{getIcon()}</span>
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <div className="flex-shrink-0 ml-3">
                    <button
                        onClick={() => {
                            setIsAnimating(false);
                            setTimeout(onClose, 300);
                        }}
                        className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors duration-200"
                    >
                        <span className="text-lg">×</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast; 