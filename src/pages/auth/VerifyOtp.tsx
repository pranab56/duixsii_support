import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getFromLocalStorage } from '../../utils/localStorage';
import AuthLayout from '../../components/layout/AuthLayout';
import { useForgotEmailOTPCheckMutation, useResendPasswordMutation } from '../../features/auth/authApi';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const [verifyOtp, { isLoading }] = useForgotEmailOTPCheckMutation();
    const [resendOtp, { isLoading: isResending }] = useResendPasswordMutation();

    const rawEmail = getFromLocalStorage("email");
    let userEmail = "";
    if (rawEmail) {
        try {
            userEmail = JSON.parse(rawEmail);
        } catch {
            userEmail = rawEmail;
        }
    }

    const handleResendEmail = async () => {
        const forgetToken = getFromLocalStorage("forgetToken");
        try {
            const res = await resendOtp({
                token: forgetToken,
                data: { email: userEmail },
            }).unwrap();

            Swal.fire({
                title: "OTP Resent",
                text: res.message || res.data?.message || `A new code has been sent to ${userEmail || 'your email'}`,
                icon: "success",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Resend Failed",
                text: err?.data?.message || err?.message || "Failed to resend OTP code.",
            });
        }
    };

    const onFinish = async (values: { otp: string }) => {
        const forgetToken = getFromLocalStorage("forgetToken");
        try {
            const res = await verifyOtp({
                token: forgetToken,
                data: { otp: values.otp },
            }).unwrap();

            if (res?.success) {
                Swal.fire({
                    text: res.message || res.data?.message || "OTP Verified Successfully",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1200,
                }).then(() => {
                    navigate("/new-password");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Invalid OTP",
                    text: res?.message || "Verification failed.",
                });
            }
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Verification Failed",
                text: err?.data?.message || err?.message || "Invalid OTP code. Please try again.",
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
                <h1 className="text-3xl font-extrabold tracking-tight text-[#333333] mb-2">Verify Code</h1>
                <p className="text-sm text-[#707070] leading-relaxed max-w-[360px] mx-auto">
                    An Authentication code has been sent to <br />
                    <span className="text-[#333333] font-semibold">{userEmail || "your email"}</span>
                </p>
            </div>

            <Form name="verify_otp" layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="otp"
                    label={
                        <span className="text-[#333333] text-sm font-semibold">
                            Enter Code<span className="text-[#ff4d4f] ml-0.5">*</span>
                        </span>
                    }
                    rules={[
                        { required: true, message: 'Please input 6-digit verification code!' },
                        { len: 6, message: 'Verification code must be 6 digits!' }
                    ]}
                    className="mb-4"
                >
                    <div className="light-otp-input py-2">
                        <Input.OTP
                            length={6}
                            size="large"
                        />
                    </div>
                </Form.Item>

                <div className="text-sm flex items-center justify-start gap-1 mb-6 mt-1">
                    <span className="text-[#707070]">Didn't receive a code?</span>
                    <button
                        type="button"
                        disabled={isResending}
                        className="text-[#ff4d4f] font-bold hover:underline cursor-pointer disabled:opacity-50"
                        onClick={handleResendEmail}
                    >
                        {isResending ? "Resending..." : "Resend"}
                    </button>
                </div>

                <Form.Item className="mb-0">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="w-full text-base font-bold uppercase tracking-wider"
                        style={{ border: 'none' }}
                    >
                        Next
                    </Button>
                </Form.Item>

                <div className="text-center mt-6">
                    <Link to="/login" className="text-[#707070] hover:text-[#56000c] text-sm hover:underline font-medium">
                        Back to login
                    </Link>
                </div>
            </Form>
        </AuthLayout>
    );
};

export default VerifyOtp;
