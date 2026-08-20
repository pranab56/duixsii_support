import { Button, Checkbox, Form } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { setToLocalStorage } from '../../utils/localStorage';
import { FormInput } from '../../components/ui/FormInput';
import AuthLayout from '../../components/layout/AuthLayout';
import { useLoginMutation } from '../../features/auth/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { setToken, setRole } from '../../features/auth/authSlice';
import { saveToken } from '../../utils/storage';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const handleSuccessLogin = (response: {
        success: boolean;
        message: string;
        data: {
            userData: {
                _id: string;
                fullName: string;
                email: string;
                role: string;
            };
            accessToken: string;
            refreshToken: string;
        };
    }) => {
        const { accessToken, refreshToken, userData } = response.data;
        const userRole = userData?.role || "support_agent";

        // Save token using standard storage helper (localStorage + cookie)
        if (accessToken) {
            saveToken(accessToken);
            setToLocalStorage("accessToken", accessToken);
            dispatch(setToken(accessToken));
        }

        if (refreshToken) {
            setToLocalStorage("refreshToken", refreshToken);
        }

        // Save role in both localStorage keys and Redux store
        setToLocalStorage("userRole", userRole);
        setToLocalStorage("role", userRole);
        if (userData?.role) {
            dispatch(setRole(userRole));
        }

        // Save user data for UserProvider context
        const userInfo = {
            _id: userData._id,
            email: userData.email,
            name: userData.fullName,
            role: userRole,
            status: "active"
        };
        setToLocalStorage("userData", JSON.stringify(userInfo));

        // Determine target path based on user role
        const normalizedRole = userRole.toLowerCase();
        let targetPath = '/';
        if (normalizedRole.includes('manager')) {
            targetPath = '/';
        } else {
            targetPath = '/';
        }

        // Role-based notification and redirection
        Swal.fire({
            title: "Login Successful",
            text: response.message || "Welcome to Support Dashboard",
            icon: "success",
            timer: 1200,
            showConfirmButton: false
        }).then(() => {
            navigate(targetPath, { replace: true });
        });
    };

    const onFinish = async (values: { email: string; password: string }) => {
        try {
            const res = await login(values).unwrap();
            if (res && res.data) {
                handleSuccessLogin(res);
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            const errorMessage = err?.data?.message || err?.message || "Invalid email or password! Please check your credentials.";
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: errorMessage,
            });
        }
    };

    return (
        <AuthLayout>
            <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-[#56000c]/10 shadow-sm">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#333333] mb-2">Welcome!</h1>
                <p className="text-sm text-[#707070] leading-relaxed max-w-[360px] mx-auto">
                    Please sign in to access your dashboard and manage your platform securely
                </p>
            </div>

            <Form name="login" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
                <FormInput
                    name="email"
                    label={<span className="text-[#333333] text-sm font-semibold">Email<span className="text-[#ff4d4f] ml-0.5">*</span></span>}
                    placeholder="Enter your email"
                    type="text"
                    inputClassName="bg-[#f0f0f0] border-none text-[#333333] placeholder:text-[#8c8c8c]"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email address!' }]}
                />

                <FormInput
                    name="password"
                    label={<span className="text-[#333333] text-sm font-semibold">Password<span className="text-[#ff4d4f] ml-0.5">*</span></span>}
                    placeholder="Enter your password"
                    type="password"
                    inputClassName="bg-[#f0f0f0] border-none text-[#333333] placeholder:text-[#8c8c8c]"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                />

                <div className="flex items-center justify-between mb-6 mt-2">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox className="text-[#333333] select-none text-sm">Remember me</Checkbox>
                    </Form.Item>
                    <Link to="/forget-password" className="text-[#ff4d4f] text-sm font-semibold hover:underline">
                        Forgot Password?
                    </Link>
                </div>

                <Form.Item className="mb-0">
                    <Button type="primary" htmlType="submit" loading={isLoading} className="w-full text-base font-bold uppercase tracking-wider" style={{ border: 'none' }}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </AuthLayout>
    );
};

export default Login;
