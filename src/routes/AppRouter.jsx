import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRouter from './AdminRouter';
import UserRouter from './UserRouter';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage'; 
import PrivateRoute from '../components/PrivateRoute'; 

const AppRouter = () => {
    return (
        <Routes>
            {/* 1. Route Đăng nhập / Đăng ký */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 2. KHU VỰC ADMIN (ĐƯỢC BẢO VỆ) 🔐 */}
            {/* Chúng ta dùng path="/admin/*" để AdminRouter bên trong có thể tự xử lý các route con */}
            <Route element={<PrivateRoute requiredRole="ADMIN" />}>
                <Route path="/admin/*" element={<AdminRouter />} />
            </Route>

            {/* 3. KHU VỰC USER */}
            {/* Lưu ý: UserRouter nên để cuối cùng để không đè lên các route trên */}
            <Route path="/*" element={<UserRouter />} />
            
            {/* Tự động chuyển hướng nếu vào đường dẫn lạ (Tùy chọn) */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;