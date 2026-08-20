import { Form, Button, Input } from 'antd';
import Swal from 'sweetalert2';
import { useChangePasswordMutation } from '../../features/profile/profileApi';

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleChangePassword = async (values: { oldPassword: string; newPassword: string }) => {
        try {
            const res = await changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            }).unwrap();

            Swal.fire({
                title: 'Success',
                text: res?.message || 'Password updated successfully!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            }).then(() => form.resetFields());
        } catch (err: any) {
            Swal.fire({
                title: 'Failed',
                text: err?.data?.message || err?.message || 'Failed to change password. Please check your old password.',
                icon: 'error',
            });
        }
    };

    return (
        <div className="max-w-lg mx-auto py-4">
            <Form form={form} layout="vertical" onFinish={handleChangePassword}>
                {/* Old / Current Password */}
                <Form.Item
                    name="oldPassword"
                    label={<span className="block text-[#333333] font-medium text-sm mb-1">Old Password</span>}
                    rules={[{ required: true, message: 'Please input your old password!' }]}
                >
                    <Input.Password 
                        placeholder="Enter old password" 
                        className="h-11 bg-white border-[#FFD2D6] text-[#333333] rounded-xl placeholder:text-gray-400 focus:border-[#56000c]"
                    />
                </Form.Item>

                {/* New Password */}
                <Form.Item
                    name="newPassword"
                    label={<span className="block text-[#333333] font-medium text-sm mb-1">New Password</span>}
                    rules={[
                        { required: true, message: 'Please input your new password!' },
                        { min: 6, message: 'Password must be at least 6 characters long!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('oldPassword') !== value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('New password cannot be the same as the old password!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password 
                        placeholder="Enter new password" 
                        className="h-11 bg-white border-[#FFD2D6] text-[#333333] rounded-xl placeholder:text-gray-400 focus:border-[#56000c]"
                    />
                </Form.Item>

                {/* Confirm Password */}
                <Form.Item
                    name="confirmPassword"
                    label={<span className="block text-[#333333] font-medium text-sm mb-1">Confirm New Password</span>}
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm your new password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password 
                        placeholder="Confirm new password" 
                        className="h-11 bg-white border-[#FFD2D6] text-[#333333] rounded-xl placeholder:text-gray-400 focus:border-[#56000c]"
                    />
                </Form.Item>

                {/* Save Password Button */}
                <Form.Item className="flex justify-center mt-6">
                    <Button 
                        loading={isLoading}
                        style={{ 
                            height: 44, 
                            borderRadius: '10px', 
                            fontWeight: 600, 
                            paddingLeft: '36px', 
                            paddingRight: '36px',
                            background: '#56000c',
                            borderColor: 'transparent',
                            color: '#ffffff'
                        }} 
                        type="primary" 
                        htmlType="submit"
                    >
                        {isLoading ? 'Updating...' : 'Save Password'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePassword;
