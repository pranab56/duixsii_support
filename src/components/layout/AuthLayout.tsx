import React from 'react';
import { ConfigProvider } from 'antd';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#56000c',
                    colorBgContainer: '#f0f0f0',
                    colorText: '#333333',
                    colorTextPlaceholder: '#8c8c8c',
                    colorBorder: 'transparent',
                    borderRadius: 12,
                },
                components: {
                    Input: {
                        activeBorderColor: '#56000c',
                        hoverBorderColor: '#7d1522',
                        colorBgContainer: '#f0f0f0',
                        colorText: '#333333',
                        colorTextPlaceholder: '#8c8c8c',
                    },
                    Checkbox: {
                        colorText: '#333333',
                        colorPrimary: '#56000c',
                        colorPrimaryBorder: '#56000c',
                    },
                    Button: {
                        colorPrimary: '#56000c',
                        colorPrimaryHover: '#7d1522',
                        colorText: '#ffffff',
                        colorPrimaryActive: '#400008',
                        borderRadius: 12,
                        controlHeight: 48,
                    }
                }
            }}
        >
            <div className="relative min-h-screen w-full flex items-center justify-center bg-[#FAF6F0] overflow-hidden py-12 px-4 md:px-6">
                {/* Flower Decor at bottom left */}
                <img 
                    src="/auth.png" 
                    alt="Flower Decor" 
                    className="absolute bottom-0 left-0 max-h-[350px] md:max-h-[450px] w-auto object-contain object-left-bottom pointer-events-none select-none z-0 animate-fade-in"
                />

                {/* Auth Card Container */}
                <div 
                    className="w-full max-w-[540px] bg-white rounded-[28px] p-8 md:p-12 shadow-[0_0_40px_rgba(255,210,210,0.75)] text-[#333333] flex flex-col justify-center animate-fade-in relative z-10"
                    style={{ minHeight: '520px' }}
                >
                    {children}
                </div>
            </div>
        </ConfigProvider>
    );
};

export default AuthLayout;
export { AuthLayout };
