import React from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            // 1. Gọi API đăng nhập
            const res = await authService.login(values.username, values.password);
            const { token, user } = res.data; 
            
            // 2. Lưu thông tin vào Context & LocalStorage
            login(user, token);
            message.success('Đăng nhập thành công!');

            // 3. Kiểm tra quyền để điều hướng
            // Logic: Lấy .name nếu là object, lấy chính nó nếu là string
            const roleName = user.role?.name || user.role;

            if (roleName?.toUpperCase() === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            message.error(error.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={3}>Đăng Nhập</Title>
                </div>
                
                <Form
                    name="login_form"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập Tên đăng nhập!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" size="large" />
                    </Form.Item>
                    
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    
                    <div style={{ textAlign: 'center' }}>
                         Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;