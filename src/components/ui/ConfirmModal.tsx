import { Modal } from 'antd';
import { FiAlertTriangle } from 'react-icons/fi';
import { IoCloseCircleOutline } from 'react-icons/io5';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    description: string;
    type: 'danger' | 'warning';
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    confirmText?: string;
}

export const ConfirmModal = ({ 
    open, 
    title, 
    description, 
    type, 
    onConfirm, 
    onCancel,
    isLoading = false,
    confirmText = 'Confirm',
}: ConfirmModalProps) => {
    return (
        <Modal
            open={open}
            onCancel={isLoading ? undefined : onCancel}
            footer={null}
            closeIcon={null}
            centered
            width={400}
            styles={{
                content: {
                    background: '#ffffff',
                    padding: '32px',
                    borderRadius: '16px',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                },
                mask: {
                    backdropFilter: 'blur(4px)',
                }
            }}
        >
            <div className="flex flex-col items-center text-center relative">
                {/* Icon */}
                <div className="mb-4">
                    {type === 'danger' ? (
                        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#ff2150]">
                            <IoCloseCircleOutline size={36} />
                        </div>
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                            <FiAlertTriangle size={30} />
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-gray-900 text-xl font-bold font-sans m-0">{title}</h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mt-3.5 leading-relaxed font-sans max-w-xs m-0">
                    {description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 w-full mt-6">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onCancel}
                        className="flex-1 h-11 rounded-lg text-gray-700 font-medium border border-gray-300 bg-white transition-all hover:bg-gray-50 cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onConfirm}
                        className="flex-1 h-11 rounded-lg text-white font-semibold transition-all active:scale-98 cursor-pointer border-0 outline-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                        style={{
                            background: type === 'danger' ? '#ff2150' : '#ff9100'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
