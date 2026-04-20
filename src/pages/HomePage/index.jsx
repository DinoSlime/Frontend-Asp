import React, { useEffect, useState, useRef } from 'react';
import { Button, Typography, Carousel, Row, Col, Spin, message } from 'antd';
import { RocketOutlined, SafetyCertificateOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard/index';
import './HomePage.css';

const { Title, Text } = Typography;

// --- CONSTANTS ---
const BANNER_IMAGE = "https://images.unsplash.com/photo-1556906781-9a412961d289?auto=format&fit=crop&w=1600&q=80";

const SERVICE_ITEMS = [
    { id: 1, icon: <RocketOutlined />, title: "Giao Hàng Hỏa Tốc", desc: "Nhận hàng trong vòng 2h" },
    { id: 2, icon: <SafetyCertificateOutlined />, title: "Cam Kết Chính Hãng", desc: "Hoàn tiền 111% nếu hàng giả" },
    { id: 3, icon: <CustomerServiceOutlined />, title: "Hỗ Trợ 24/7", desc: "Luôn sẵn sàng giải đáp" },
];

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // 2. Khởi tạo navigate

    // 3. Tạo Ref để làm "mỏ neo" cho phần Sản phẩm mới
    const newProductsRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await productService.getAll();
            const data = res.data?.content || res.data || [];
            
            if (Array.isArray(data)) {
                // Lấy 8 sản phẩm đầu tiên để hiển thị ở trang chủ
                setProducts(data.slice(0, 8));
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Lỗi lấy sản phẩm:", error);
            message.error("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    // 4. Hàm xử lý cuộn trang mượt mà
    const scrollToNewProducts = () => {
        if (newProductsRef.current) {
            newProductsRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    return (
        <div className="homepage-content">
            {/* 1. BANNER SECTION */}
            <Carousel autoplay effect="fade">
                <div>
                    <div className="banner-wrapper" style={{ backgroundImage: `url('${BANNER_IMAGE}')` }}>
                        <div className="banner-overlay d-flex flex-column justify-center align-center">
                            <Title level={1} className="text-white mb-10">BST MÙA HÈ 2026</Title>
                            <Text className="text-white mb-20" style={{ fontSize: '18px' }}>
                                Khám phá phong cách mới nhất
                            </Text>
                            <div className="d-flex gap-sm">
                                <Button 
                                    type="primary" 
                                    size="large" 
                                    shape="round" 
                                    className="font-bold px-20"
                                    onClick={scrollToNewProducts} // Cuộn xuống khi click
                                >
                                    SẢN PHẨM MỚI
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Carousel>

            <div className="container py-20">
                {/* 2. SERVICES SECTION */}
                <Row gutter={[32, 32]} className="text-center mb-40 mt-20">
                    {SERVICE_ITEMS.map(item => (
                        <Col xs={24} md={8} key={item.id}>
                            <div className="service-icon">{item.icon}</div>
                            <Title level={4}>{item.title}</Title>
                            <Text type="secondary">{item.desc}</Text>
                        </Col>
                    ))}
                </Row>

                {/* 3. PRODUCTS SECTION */}
                <div 
                    className="text-center mb-40" 
                    ref={newProductsRef} 
                    id="new-arrivals-section"
                    style={{ paddingTop: '20px' }} 
                >
                    <Title level={2}>Sản Phẩm Mới Nhất</Title>
                    <div style={{ width: '60px', height: '4px', background: 'var(--primary-color)', margin: '0 auto' }}></div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <Spin tip="Đang tải...">
                            <div className="content-to-load" />
                        </Spin>
                    </div>
                ) : (
                    <Row gutter={[24, 24]}>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <ProductCard product={product} />
                                </Col>
                            ))
                        ) : (
                            <div className="w-100 text-center">
                                <Text type="secondary">Chưa có sản phẩm nào.</Text>
                            </div>
                        )}
                    </Row>
                )}

                {/* 5. Nút Xem tất cả sản phẩm điều hướng sang trang /products */}
                <div className="text-center mt-40 mb-20">
                     <Button 
                        size="large" 
                        type="default" 
                        onClick={() => navigate('/products')} // Chuyển hướng trang
                        style={{ borderRadius: '8px', padding: '0 40px', fontWeight: 'bold' }}
                     >
                        Xem tất cả sản phẩm
                     </Button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;