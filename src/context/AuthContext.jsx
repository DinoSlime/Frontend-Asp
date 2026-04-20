import React, { createContext, useState, useContext } from 'react'; // Bỏ useEffect thừa
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // 👇 SỬA Ở ĐÂY: Đọc dữ liệu ngay khi khởi tạo State
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            
            // Nếu có đủ cả user và token thì lấy ra dùng luôn
            if (storedUser && token) {
                return JSON.parse(storedUser);
            }
            return null;
        } catch (error) {
            // Nếu dữ liệu lỗi thì xóa sạch
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return null;
        }
    });

    // (Đã bỏ useEffect vì không cần thiết nữa)

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        message.success('Đã đăng xuất');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);