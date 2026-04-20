import React from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

const { Title } = Typography;

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            // Chuẩn hóa dữ liệu gửi về Backend
            const registerData = {
                fullname: values.fullName,
                username: values.username,
                password: values.password,
                retype_password: values.confirm,
                
                // 👇 ĐÃ SỬA: Lấy số điện thoại thật từ form
                phone_number: values.phoneNumber, 
                
                // Các trường mặc định khác
                address: "",
                date_of_birth: new Date(),
                facebook_account_id: 0,
                google_account_id: 0
            };

            await authService.register(registerData);
            
            message.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');

        } catch (error) {
            // Xử lý thông báo lỗi từ Backend
            if (error.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    message.error(errorData);
                } else if (errorData.message) {
                    message.error(errorData.message);
                } else {
                    message.error('Thông tin đăng ký không hợp lệ!');
                }
            } else {
                message.error('Đăng ký thất bại. Vui lòng thử lại sau.');
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={3}>Đăng Ký Tài Khoản</Title>
                    <p>Tạo tài khoản của bạn</p>
                </div>

                <Form
                    name="register_form"
                    onFinish={onFinish}
                    layout="vertical"
                    scrollToFirstError
                >
                    {/* 1. Họ và tên */}
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input prefix={<IdcardOutlined />} />
                    </Form.Item>

                    {/* 2. Số điện thoại (MỚI THÊM) */}
                    <Form.Item
                        name="phoneNumber"
                        label="Số điện thoại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ (10-11 số)!' }
                        ]}
                    >
                        <Input prefix={<PhoneOutlined />} />
                    </Form.Item>

                    {/* 3. Tên đăng nhập */}
                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[{ required: true, message: 'Vui lòng nhập Tên đăng nhập!' }]}
                    >
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>

                    {/* 4. Mật khẩu */}
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                        hasFeedback
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    {/* 5. Xác nhận mật khẩu */}
                    <Form.Item
                        name="confirm"
                        label="Xác nhận mật khẩu"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            Đăng Ký
                        </Button>
                    </Form.Item>
                    
                    <div style={{ textAlign: 'center' }}>
                         Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;