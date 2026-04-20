import React, { useContext } from 'react'; 
import { Layout, Menu, Button, Badge, Dropdown, Avatar, Typography, Space } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import { useAuth } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext'; 
import './AppHeader.css';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Để biết đang ở trang nào

    // Lấy tổng số lượng sản phẩm từ Context
    const { totalItems } = useContext(CartContext);

    // --- 1. Xử lý Đăng xuất ---
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // --- 2. Xử lý Menu Chính ---
    const handleMenuClick = (e) => {
        switch (e.key) {
            case 'home':
                navigate('/');
                // Cuộn lên đầu trang chủ
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
                
            case 'products': // Nút "Sản phẩm mới"
                if (location.pathname !== '/') {
                    // Nếu đang ở trang khác -> Về trang chủ
                    navigate('/');
                    // Đợi 1 chút cho trang load xong rồi cuộn (Optional)
                    setTimeout(() => {
                        const section = document.getElementById('new-arrivals-section');
                        if(section) section.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                } else {
                    // Nếu đang ở trang chủ rồi -> Tìm ID và cuộn xuống
                    const section = document.getElementById('new-arrivals-section');
                    if(section) section.scrollIntoView({ behavior: 'smooth' });
                }
                break;
                
            case 'men':
                // navigate('/category/men');
                break;
            default:
                break;
        }
    };

    // Danh sách mục Menu chính
    const mainMenuItems = [
        { key: 'home', label: 'Trang chủ' },
        { key: 'products', label: 'Sản phẩm mới' }, // Khi bấm sẽ chạy logic ở trên
        { key: 'men', label: 'Nam' },
        { key: 'women', label: 'Nữ' },
        { key: 'sale', label: 'Khuyến mãi' },
    ];

    // Danh sách mục Dropdown User
    const userMenuItems = [
        { 
            key: 'profile', 
            label: <Link to="/profile">Thông tin tài khoản</Link>, 
            icon: <UserOutlined /> 
        },
        { 
            key: 'orders', 
            // Đã gắn Link đúng
            label: <Link to="/orders">Đơn mua</Link>, 
            icon: <ShoppingCartOutlined /> 
        },
        // Nếu user là ADMIN thì hiện thêm menu quản lý
        ...(user?.role?.name === 'ADMIN' || user?.role_id === 1 ? [{
            key: 'admin',
            label: <Link to="/admin/orders">Trang quản trị</Link>,
            icon: <UserOutlined />
        }] : []),
        { type: 'divider' },
        { 
            key: 'logout', 
            label: 'Đăng xuất', 
            icon: <LogoutOutlined />, 
            onClick: handleLogout, 
            danger: true 
        },
    ];

    return (
        <Header className="app-header px-20 d-flex align-center justify-between">
            {/* --- Logo: Bấm vào về trang chủ --- */}
            <div className="logo cursor-pointer" onClick={() => navigate('/')}>
                SneakerStore
            </div>

            {/* --- Menu Giữa --- */}
            <div className="flex-1 d-flex justify-center" style={{ height: '100%' }}>
                <Menu 
                    className="menu-custom w-100 d-flex justify-center"
                    mode="horizontal" 
                    defaultSelectedKeys={['home']} 
                    items={mainMenuItems} 
                    onClick={handleMenuClick} 
                    disabledOverflow 
                />
            </div>

            {/* --- Khu vực User & Giỏ hàng --- */}
            <div className="d-flex align-center gap-md" style={{ height: '100%' }}>
                
                {/* Badge hiển thị số lượng */}
                <Badge count={totalItems} showZero onClick={() => navigate('/cart')} className="cursor-pointer">
                    <Button icon={<ShoppingCartOutlined />} shape="circle" size="large" />
                </Badge>

                {user ? (
                    <Dropdown 
                        menu={{ items: userMenuItems }} 
                        placement="bottomRight" 
                        arrow
                        rootClassName="user-app-scope" 
                        getPopupContainer={(trigger) => trigger.parentElement}
                    >
                        <Space className="d-flex align-center gap-sm cursor-pointer header-user-info">
                            <Avatar style={{ backgroundColor: 'var(--primary-color)' }} icon={<UserOutlined />} />
                            <Text strong style={{ color: '#fff' }}>
                                {user.fullName || user.username}
                            </Text>
                        </Space>
                    </Dropdown>
                ) : (
                    <Space className="d-flex gap-sm">
                        <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
                        <Button type="primary" onClick={() => navigate('/register')}>Đăng ký</Button>
                    </Space>
                )}
            </div>
        </Header>
    );
};

export default AppHeader;