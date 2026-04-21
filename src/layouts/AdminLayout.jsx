import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { 
    MenuFoldOutlined, 
    MenuUnfoldOutlined, 
    DashboardOutlined, 
    ShoppingOutlined, 
    UserOutlined, 
    OrderedListOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom'; // 👈 Thêm useLocation

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation(); // 👈 Lấy vị trí hiện tại để Menu không bị nhảy

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div style={{ 
                    height: '32px', 
                    margin: '16px', 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    borderRadius: '6px',
                    textAlign: 'center',
                    color: 'white',
                    lineHeight: '32px',
                    fontWeight: 'bold'
                }}>
                    {collapsed ? 'S' : 'SNEAKER ADMIN'}
                </div>
                
                <Menu
                    theme="dark"
                    mode="inline"
                    // 👇 Tự động highlight Menu dựa trên đường dẫn thực tế trên thanh địa chỉ
                    selectedKeys={[location.pathname]} 
                    onClick={({ key }) => navigate(key)}
                    items={[
                        {
                            key: '/admin', // Khớp với index route
                            icon: <DashboardOutlined />,
                            label: 'Tổng quan',
                        },
                        {
                            key: '/admin/products', // Khớp với path="products" trong AdminRouter
                            icon: <ShoppingOutlined />,
                            label: 'Quản lý Sản phẩm',
                        },
                        {
                            key: '/admin/categories', 
                            icon: <OrderedListOutlined />, 
                            label: 'Quản lý Danh mục',
                        },
                        {
                            key: '/admin/orders',
                            icon: <OrderedListOutlined />,
                            label: 'Quản lý Đơn hàng',
                        },
                        {
                            key: '/admin/users',
                            icon: <UserOutlined />,
                            label: 'Khách hàng',
                        },
                    ]}
                />
            </Sider>

            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>TRANG QUẢN TRỊ HỆ THỐNG</span>
                </Header>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: 'initial' // Tránh lỗi scroll nếu content quá dài
                    }}
                >
                    {/* 👇 CỰC KỲ QUAN TRỌNG: Phải có thẻ này để hiện ruột bên trong */}
                    <Outlet /> 
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;