import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminRouter from './AdminRouter';
import UserRouter from './UserRouter';
import LoginPage from '../pages/Auth/LoginPage'; // Mới tạo
import RegisterPage from '../pages/Auth/RegisterPage'; 
import PrivateRoute from '../components/PrivateRoute'; 

const AppRouter = () => {
    return (
        <Routes>
            {/* 1. Route Đăng nhập / Đăng ký (Ai cũng vào được) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 2. KHU VỰC ADMIN (ĐƯỢC BẢO VỆ) 🔐 */}
            {/* Bọc Route này bằng PrivateRoute và yêu cầu quyền ADMIN */}
            <Route element={<PrivateRoute requiredRole="ADMIN" />}>
                <Route path="/admin/*" element={<AdminRouter />} />
            </Route>

            {/* 3. KHU VỰC USER (Ai cũng vào được, hoặc nếu cần user login thì bọc PrivateRoute không cần role) */}
            <Route path="/*" element={<UserRouter />} />
            
        </Routes>
    );
};

export default AppRouter;