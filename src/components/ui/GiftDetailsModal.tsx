import { Modal } from 'antd';
import { FiMail, FiPackage, FiMessageSquare, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { Gift } from '../../pages/review/review.types';
import ModalHeader from './ModalHeader';
import InfoBlock from './InfoBlock';

interface GiftDetailsModalProps {
    open: boolean;
    gift: Gift | null;
    onClose: () => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    Redeemed: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    Pending:  { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    Expired:  { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
};

export const GiftDetailsModal = ({ open, gift, onClose }: GiftDetailsModalProps) => {
    if (!gift) return null;

    const statusStyle = STATUS_STYLES[gift.status] ?? STATUS_STYLES['Pending'];

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            width={600}
            styles={{
                content: {
                    background: '#ffffff',
                    padding: 0,
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                },
                mask: {
                    backdropFilter: 'blur(4px)',
                }
            }}
            modalRender={() => (
                <div
                    className="p-6 rounded-2xl flex flex-col gap-6 relative border border-gray-100 bg-white"
                >
                    <ModalHeader title="Gift Details" onClose={onClose} />

                    {/* Gift Summary Banner */}
                    <div
                        className="rounded-xl p-4 flex items-center gap-4 border border-pink-100 bg-pink-50/80"
                    >
                        <div className="w-14 h-14 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-2xl shrink-0">
                            🎁
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-bold text-base m-0 truncate">{gift.productName}</p>
                            <p className="text-gray-500 text-xs m-0 mt-1">Gift ID: {gift.giftId}</p>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shrink-0 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                            {gift.status}
                        </span>
                    </div>

                    {/* Sender / Receiver */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                            className="p-4 rounded-xl flex flex-col gap-2 border border-gray-100 bg-gray-50/80"
                        >
                            <p className="text-gray-400 text-[11px] font-medium m-0 uppercase tracking-wider">From (Sender)</p>
                            <p className="text-gray-900 font-semibold text-sm m-0">{gift.senderName}</p>
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <FiMail size={12} />
                                <span className="text-xs truncate">{gift.senderEmail}</span>
                            </div>
                        </div>
                        <div
                            className="p-4 rounded-xl flex flex-col gap-2 border border-gray-100 bg-gray-50/80"
                        >
                            <p className="text-gray-400 text-[11px] font-medium m-0 uppercase tracking-wider">To (Receiver)</p>
                            <p className="text-gray-900 font-semibold text-sm m-0">{gift.receiverName}</p>
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <FiMail size={12} />
                                <span className="text-xs truncate">{gift.receiverEmail}</span>
                            </div>
                        </div>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoBlock
                                label="Amount"
                                value={gift.amount}
                                icon={<FiDollarSign size={16} />}
                                valueClassName="text-xl font-bold mt-0.5 font-sans"
                            />
                            <InfoBlock
                                label="Sent Date"
                                value={gift.sentDate}
                                icon={<FiCalendar size={16} />}
                            />
                        </div>
                        <InfoBlock
                            label="Product"
                            value={gift.productName}
                            icon={<FiPackage size={16} />}
                        />
                        <InfoBlock
                            label="Message"
                            value={gift.message || '—'}
                            icon={<FiMessageSquare size={16} />}
                        />
                    </div>
                </div>
            )}
        />
    );
};

export default GiftDetailsModal;
