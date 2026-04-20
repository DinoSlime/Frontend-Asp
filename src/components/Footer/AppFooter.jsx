import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import './AppFooter.css'; 

const { Footer } = Layout;
const { Title, Text } = Typography;

const AppFooter = () => {
    return (
        
        <Footer className="app-footer text-center">
            <div className="container"> 
                <Row justify="center" gutter={[32, 32]}>
                    <Col xs={24} md={8}>
                        
                        <Title level={4} className="text-white">SneakerStore</Title>
                        <Text className="footer-text">Uy tín tạo nên thương hiệu. Chuyên cung cấp giày chính hãng.</Text>
                    </Col>
                    <Col xs={24} md={8}>
                        <Title level={4} className="text-white">Liên hệ</Title>
                        <Text className="footer-text">Hotline: 1900 1234</Text>
                        <Text className="footer-text">Email: support@sneakerstore.com</Text>
                    </Col>
                    <Col xs={24} md={8}>
                        <Title level={4} className="text-white">Địa chỉ</Title>
                        <Text className="footer-text">123 Đường ABC, Quận 1, TP.HCM</Text>
                    </Col>
                </Row>
                
                <div className="footer-copyright text-white">
                    SneakerStore ©2026 Created with Ant Design
                </div>
            </div>
        </Footer>
    );
};

export default AppFooter;