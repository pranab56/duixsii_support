import React from 'react';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    size?: 'small' | 'medium' | 'large';
    text?: string;
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    fullScreen = false,
    size = 'medium',
    text,
    className = '',
}) => {
    const sizeClasses = {
        small: 'w-6 h-6 border-2',
        medium: 'w-12 h-12 border-3',
        large: 'w-16 h-16 border-4',
    };

    const spinnerContent = (
        <div className={`flex flex-col items-center justify-center gap-3.5 ${className}`}>
            <div className="relative flex items-center justify-center">
                {/* Outer glowing ring */}
                <div
                    className={`${sizeClasses[size]} rounded-full border-t-[#56000c] border-r-[#56000c]/40 border-b-transparent border-l-transparent animate-spin`}
                    style={{
                        borderColor: 'rgba(86, 0, 12, 0.2)',
                        borderTopColor: '#56000c',
                        borderRightColor: 'rgba(86, 0, 12, 0.5)',
                    }}
                />
                
                {/* Inner accent pulsing dot */}
                <div className="absolute w-2 h-2 rounded-full bg-[#56000c] animate-ping" />
            </div>

            {text && (
                <p className="text-gray-600 text-xs sm:text-sm font-medium tracking-wide font-sans m-0 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20"
            >
                {spinnerContent}
            </div>
        );
    }

    return (
        <div className="w-full min-h-[220px] flex items-center justify-center py-10">
            {spinnerContent}
        </div>
    );
};

export default LoadingSpinner;
