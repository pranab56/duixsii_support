import { useState } from 'react';
import { ConfigProvider, Layout, Menu, MenuProps } from 'antd';
import { TSidebarItem } from '../../utils/generateSidebarItems';
import { agentItems, managerItems } from '../../utils/sidebarItems';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getFromLocalStorage, removeFromLocalStorage } from '../../utils/localStorage';
import { TbLogout } from 'react-icons/tb';
import ConfirmModal from '../ui/ConfirmModal';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../features/auth/authSlice';

const { Sider } = Layout;

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const rawRole = getFromLocalStorage('userRole') || getFromLocalStorage('role') || 'support_agent';
    const isManager = rawRole === 'Support Manager' || rawRole === 'support_manager' || rawRole.toLowerCase().includes('manager');
    const items = isManager ? managerItems : agentItems;
    const displayRole = isManager ? 'Support Manager' : 'Support Agent';

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

    const sidebarItemsGenerator = (itemsList: TSidebarItem[]): MenuProps['items'] => {
        return itemsList.map((item) => ({
            key: item.path === '' ? '/' : `/${item.path}`,
            icon: item.icon,
            label: <Link to={item.path === '' ? '/' : `/${item.path}`}>{item.label}</Link>,
        }));
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Montserrat, sans-serif',
                },
                components: {
                    Menu: {
                        itemBg: 'transparent',
                        itemColor: '#56000c',
                        itemHoverColor: '#56000c',
                        itemHoverBg: 'rgba(86, 0, 12, 0.05)',
                        itemSelectedColor: '#ffffff',
                        itemSelectedBg: '#56000c',
                        itemActiveBg: '#56000c',
                        itemBorderRadius: 8,
                        itemHeight: 44,
                        itemMarginBlock: 6,
                        itemMarginInline: 8,
                    },
                },
            }}
        >
            <Sider
                width={260}
                breakpoint="lg"
                collapsedWidth="0"
                style={{
                    background: '#FFE5E7',
                    borderRight: '1px solid #FFD2D6',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    zIndex: 10,
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Header/Logo Section */}
                    <Link to="/">
                        <div className="flex flex-col items-center justify-center pt-8 pb-6 transition-all hover:opacity-90">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-16 h-16 object-contain rounded-full shadow-sm border border-[#56000c]/10"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/vite.svg";
                                }}
                            />
                            <h1 className="text-lg font-bold text-[#333333] mt-3 tracking-wide">Support Panel</h1>
                            <p className="text-xs text-gray-500 mt-0.5">{displayRole}</p>
                        </div>
                    </Link>

                    <div className="mx-6 border-b border-[#56000c]/10 mb-6" />

                    {/* Scrollable Menu Items */}
                    <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                        <Menu
                            theme="light"
                            mode="inline"
                            selectedKeys={[location.pathname]}
                            items={sidebarItemsGenerator(items)}
                            style={{ borderRight: 0, background: 'transparent' }}
                        />
                    </div>

                    {/* Footer / Logout Button Section */}
                    <div className="p-6 mt-auto">
                        <button
                            onClick={handleOpenLogoutModal}
                            className="w-full flex items-center justify-center gap-2 h-11 rounded-lg text-[#56000c] font-semibold transition-all hover:bg-[#56000c]/5 active:scale-95 cursor-pointer bg-transparent"
                            style={{
                                border: '1.5px solid #56000c',
                                background: 'transparent',
                            }}
                        >
                            <TbLogout size={20} />
                            <span>Logout</span>
                        </button>
                        <div className="text-center text-gray-500 text-[11px] mt-3 tracking-wide">
                            Copyright@app
                        </div>
                    </div>
                </div>
            </Sider>

            {/* Confirm Logout Modal */}
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
        </ConfigProvider>
    );
};

export default Sidebar;
