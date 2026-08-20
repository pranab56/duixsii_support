import { IoCloseOutline } from 'react-icons/io5';

interface ModalHeaderProps {
    title: string;
    onClose: () => void;
    className?: string;
}

export function ModalHeader({ title, onClose, className = '' }: ModalHeaderProps) {
    return (
        <div className={`flex items-center justify-between border-b border-gray-100 pb-4 ${className}`}>
            <h2 className="text-gray-900 text-xl font-bold m-0 font-sans">{title}</h2>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-0 outline-none cursor-pointer"
            >
                <IoCloseOutline size={24} />
            </button>
        </div>
    );
}

export default ModalHeader;
