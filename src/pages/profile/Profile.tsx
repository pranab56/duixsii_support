import React from 'react';
import { ConfigProvider, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';


const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Edit Profile',
        children: <EditProfile />,
    },
    {
        key: '2',
        label: 'Change Password',
        children: <ChangePassword />,
    },
];

const Profile: React.FC = () => (
    <div
        className="p-8 rounded-2xl bg-white border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)]"
    >
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#56000c',
                    colorText: '#333333',
                    colorTextHeading: '#242424',
                    colorBgContainer: '#ffffff',
                    colorBorder: 'rgba(86, 0, 12, 0.1)',
                },
                components: {
                    Input: {
                        colorBgContainer: '#ffffff',
                        colorText: '#333333',
                        colorTextPlaceholder: '#8c8c8c',
                        activeBorderColor: '#56000c',
                        hoverBorderColor: '#56000c',
                    },
                    Tabs: {
                        itemColor: '#6b7280',
                        itemSelectedColor: '#56000c',
                        itemHoverColor: '#56000c',
                        inkBarColor: '#56000c',
                    }
                }
            }}
        >
            <Tabs defaultActiveKey="1" items={items} size="large" />
        </ConfigProvider>
    </div>
);

export default Profile;
