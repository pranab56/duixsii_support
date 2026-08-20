import { Modal } from 'antd';
import { FiMail, FiPhone, FiMapPin, FiGift, FiCreditCard, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import { User } from '../../pages/customer/customer.types';
import ModalHeader from './ModalHeader';
import InfoBlock from './InfoBlock';

interface UserDetailsModalProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    onBlockToggle: (user: User) => void;
    onDelete: (user: User) => void;
}

export const UserDetailsModal = ({ open, user, onClose, onBlockToggle, onDelete }: UserDetailsModalProps) => {
    if (!user) return null;

    const joined = user.joined || '2025-01-15';
    const lastLogin = user.lastLogin || '2026-06-05 10:30 AM';
    const address = user.address || '123 Main St, New York, NY 10001';
    const giftsSent = user.giftsSent ?? 8;
    const giftsReceived = user.giftsReceived ?? 5;
    const walletBalance = user.walletBalance || '$125.50';

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
                    {/* Header */}
                    <ModalHeader title="User Details" onClose={onClose} />

                    {/* User Profile Summary */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#ff2150] text-2xl font-bold shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-gray-900 text-xl font-bold m-0 font-sans">{user.name}</h3>
                                <span 
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                        user.status === 'Active' 
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                            : 'bg-red-50 text-red-600 border border-red-200'
                                    }`}
                                >
                                    {user.status}
                                </span>
                            </div>
                            <p className="text-gray-500 text-xs m-0 mt-1 font-sans">
                                Joined: {joined} • Last Login: {lastLogin}
                            </p>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="flex flex-col gap-4">
                        {/* Contact details row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoBlock label="Email" value={user.email} icon={<FiMail size={16} />} />
                            <InfoBlock label="Phone" value={user.phone} icon={<FiPhone size={16} />} />
                        </div>

                        {/* Address */}
                        <InfoBlock label="Address" value={address} icon={<FiMapPin size={16} />} />

                        {/* Numeric Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { 
                                    label: 'Orders', 
                                    value: user.orders, 
                                    icon: <FiShoppingBag className="text-amber-500" size={16} />,
                                    bg: '#fffbe6',
                                    border: '#ffe58f'
                                },
                                { 
                                    label: 'Spent', 
                                    value: user.spent, 
                                    icon: <FiDollarSign className="text-purple-500" size={16} />,
                                    bg: '#f9f0ff',
                                    border: '#d3ade6'
                                },
                                { 
                                    label: 'Gifts Sent', 
                                    value: giftsSent, 
                                    icon: <FiGift className="text-pink-500" size={16} />,
                                    bg: '#fff0f6',
                                    border: '#ffadd2'
                                },
                                { 
                                    label: 'Gifts Received', 
                                    value: giftsReceived, 
                                    icon: <FiGift className="text-emerald-500" size={16} />,
                                    bg: '#f6ffed',
                                    border: '#b7eb8f'
                                }
                            ].map((stat, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-4 rounded-xl flex flex-col gap-1 border"
                                    style={{
                                        background: stat.bg,
                                        borderColor: stat.border
                                    }}
                                >
                                    <div className="flex items-center justify-between text-gray-500">
                                        <span className="text-[11px] font-medium">{stat.label}</span>
                                        {stat.icon}
                                    </div>
                                    <span className="text-gray-900 text-lg font-bold mt-1 font-sans">{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Wallet Balance */}
                        <InfoBlock 
                            label="Wallet Balance" 
                            value={walletBalance} 
                            icon={<FiCreditCard size={16} className="mt-0.5" />} 
                            valueClassName="text-2xl font-bold mt-1 font-sans"
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-4 mt-2">
                        <button
                            onClick={() => onBlockToggle(user)}
                            className="flex-1 h-12 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-98 cursor-pointer border-0 outline-none"
                            style={{
                                background: '#ff2150'
                            }}
                        >
                            {user.status === 'Active' ? 'Block' : 'Unblock'}
                        </button>
                        <button
                            onClick={() => onDelete(user)}
                            className="flex-1 h-12 rounded-xl text-gray-700 font-semibold transition-all hover:bg-gray-50 active:scale-98 cursor-pointer border border-gray-300 bg-white outline-none"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        />
    );
};

export default UserDetailsModal;
