import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Result } from 'antd';

const PrivateRoute = ({ requiredRole }) => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    // 1. Nếu chưa đăng nhập -> Đá về Login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Chuẩn hóa Role (Lấy string dù backend trả về Object hay String)
    const currentRole = (typeof user.role === 'object' && user.role?.name) 
        ? user.role.name 
        : user.role;

    // 3. Kiểm tra quyền hạn
    if (requiredRole && currentRole?.toString().toUpperCase() !== requiredRole.toUpperCase()) {
        return (
            <Result
                status="403"
                title="403 Forbidden"
                subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
                extra={
                    <Link to="/">
                        <Button type="primary">Về trang chủ</Button>
                    </Link>
                }
            />
        );
    }

    // 4. Hợp lệ -> Cho phép truy cập
    return <Outlet />;
};

export default PrivateRoute;