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
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* 1. SIDEBAR (Menu trái) */}
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
                    defaultSelectedKeys={['1']}
                    onClick={({ key }) => navigate(key)}
                    items={[
                        {
                            key: '/admin',
                            icon: <DashboardOutlined />,
                            label: 'Tổng quan',
                        },
                        {
                            key: '/admin/products',
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

            {/* 2. MAIN LAYOUT (Phần phải) */}
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
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
                    }}
                >
                    {/* Nơi hiển thị nội dung các trang con */}
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;