import { ReactNode } from 'react';

interface InfoBlockProps {
    label: string;
    value: string | number | ReactNode;
    icon: ReactNode;
    className?: string;
    valueClassName?: string;
}

export function InfoBlock({ label, value, icon, className = '', valueClassName = 'text-sm font-medium mt-0.5' }: InfoBlockProps) {
    return (
        <div className={`p-4 rounded-xl flex items-start gap-3 border border-gray-100 bg-gray-50/80 ${className}`}>
            <div className="text-gray-400 mt-1 shrink-0">
                {icon}
            </div>
            <div>
                <span className="text-gray-500 text-[11px] font-medium block">{label}</span>
                <span className={`text-gray-900 block ${valueClassName}`}>{value}</span>
            </div>
        </div>
    );
}

export default InfoBlock;
