import { Layout, Badge, Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../providers/UserProvider';
import { useContext, useState } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import { FiChevronDown } from 'react-icons/fi';
import { getFromLocalStorage, removeFromLocalStorage } from '../../utils/localStorage';
import ConfirmModal from '../ui/ConfirmModal';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../features/auth/authSlice';
import { useGetMyProfileQuery, useUpdateProfileMutation } from '../../features/profile/profileApi';
import { useGetAllNotificationQuery } from '../../features/notification/notificationApi';

const { Header } = Layout;

const HeaderDashboard = () => {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Fetch real profile data & notification query
    const { data: profileResponse } = useGetMyProfileQuery();
    const { data: notificationResponse } = useGetAllNotificationQuery();
    const [updateProfile, { isLoading: isUpdatingStatus }] = useUpdateProfileMutation();
    
    const profile = profileResponse?.data?.result;
    const notificationList = notificationResponse?.data || [];
    const notificationCount = notificationList.filter(n => !n.isRead).length;

    const isOnline = profile?.isOnline === true;

    const handleStatusToggle = async (newOnline: boolean) => {
        try {
            const formData = new FormData();
            formData.append('isOnline', newOnline ? 'true' : 'false');
            await updateProfile(formData).unwrap();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const statusMenuItems = [
        {
            key: 'online',
            label: (
                <div 
                    onClick={() => handleStatusToggle(true)} 
                    className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-emerald-50 rounded-lg transition-colors"
                >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                    <span className="text-xs font-bold text-gray-800">Online</span>
                </div>
            ),
        },
        {
            key: 'offline',
            label: (
                <div 
                    onClick={() => handleStatusToggle(false)} 
                    className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                    <span className="text-xs font-bold text-gray-700">Offline</span>
                </div>
            ),
        },
    ];

    const rawProfileImage = profile?.profile;
    const avatarUrl = rawProfileImage
        ? rawProfileImage
        : (userContext?.image && userContext.image !== "/user.svg" ? userContext.image : '/user.svg');

    const roleFromStorage = getFromLocalStorage('userRole') || getFromLocalStorage('role') || 'support_agent';
    const fullName = profile?.fullName || (userContext?.name && userContext.name !== "Mithila Admin" ? userContext.name : "Alex John");
    const rawRoleString = profile?.role || roleFromStorage;
    const displayRole = rawRoleString.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const isAgent = rawRoleString.toLowerCase().includes('agent');

    const handleOpenLogoutModal = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            dispatch(logout());
            removeFromLocalStorage('accessToken');
            removeFromLocalStorage('refreshToken');
            removeFromLocalStorage('userData');
            removeFromLocalStorage('userRole');
            removeFromLocalStorage('forgetToken');
            removeFromLocalStorage('email');
            setIsLoggingOut(false);
            setIsLogoutModalOpen(false);
            navigate('/login');
        }, 600);
    };

    const handleCancelLogout = () => {
        setIsLogoutModalOpen(false);
    };

    const profileMenuItems = [
        {
            key: 'profile',
            label: <Link to="/profile">My Profile</Link>,
            icon: <AiOutlineUser size={16} />,
        },
        {
            key: 'logout',
            label: <span className="text-red-500 font-medium">Log Out</span>,
            icon: <AiOutlineLogout size={16} className="text-red-500" />,
            onClick: handleOpenLogoutModal,
        },
    ];

    return (
        <Header
            style={{
                height: 80,
                background: '#FFE5E7',
                width: '100%',
                padding: '0 24px',
                borderBottom: '1px solid #FFD2D6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}
        >
            <div className="flex items-center gap-5">
                {/* Modern Change Status Dropdown */}
                <div className="flex flex-col items-start mr-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">
                        Status
                    </span>
                    <Dropdown menu={{ items: statusMenuItems }} trigger={['click']} placement="bottomLeft">
                        <button 
                            className="flex items-center gap-2 bg-white border border-[#FFD2D2] px-3 py-1.5 rounded-full text-xs font-bold text-[#333333] shadow-sm hover:border-[#56000c] transition cursor-pointer select-none"
                            disabled={isUpdatingStatus}
                        >
                            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-gray-400'}`} />
                            <span>{isUpdatingStatus ? 'Updating...' : (isOnline ? 'Online' : 'Offline')}</span>
                            <FiChevronDown size={14} className="text-gray-500" />
                        </button>
                    </Dropdown>
                </div>

                {/* Notifications */}
                <Link to="/notification" className="flex items-center justify-center">
                    <div className="flex items-center justify-center cursor-pointer relative transition-opacity hover:opacity-85">
                        <Badge count={notificationCount} size="small" offset={[2, -2]} color="#ff4d4f">
                            <IoNotificationsOutline size={24} className="text-[#56000c]" />
                        </Badge>
                    </div>
                </Link>

                {/* Vertical Divider */}
                <div className="w-[1.5px] h-6 bg-[#56000c]/20 self-center" />

                {/* Profile dropdown */}
                <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" trigger={['click']}>
                    <div className="flex items-center gap-3 cursor-pointer select-none py-1 px-2 rounded-lg hover:bg-[#56000c]/5 transition-colors">
                        <img
                            src={avatarUrl}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1.5px solid #56000c',
                                objectFit: 'cover',
                            }}
                            alt={fullName}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/user.svg";
                            }}
                        />
                        <div className="hidden sm:block text-left">
                            <h2 className="text-[#333333] text-sm font-semibold leading-tight">
                                {fullName}
                            </h2>
                            <p className="text-xs text-gray-500 capitalize leading-none mt-0.5">
                                {displayRole}
                            </p>
                        </div>
                    </div>
                </Dropdown>
            </div>

            {/* Logout Confirmation Modal */}
            <ConfirmModal
                open={isLogoutModalOpen}
                title="Logout"
                description="Are you sure you want to log out from your support dashboard?"
                type="danger"
                isLoading={isLoggingOut}
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
                confirmText="Logout"
            />
        </Header>
    );
};

export default HeaderDashboard;
