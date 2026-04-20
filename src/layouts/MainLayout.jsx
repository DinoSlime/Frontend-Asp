import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from '../components/Header/AppHeader'; 
import AppFooter from '../components/Footer/AppFooter';  
import '../assets/styles/global.css'; 

const { Content } = Layout;

const MainLayout = () => {
    return (
        <div className="user-app-scope">
            <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <AppHeader />
                <Content style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                   
                    <Outlet />
                </Content>
                <AppFooter />
            </Layout>
        </div>
    );
};

export default MainLayout;