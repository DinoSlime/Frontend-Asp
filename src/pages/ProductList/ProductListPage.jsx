import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Spin, Empty } from 'antd';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard/index';

const { Title, Text } = Typography;

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const params = { page: 0, limit: 1000, size: 1000 };
                const res = await productService.getAll(params);
                // Lấy dữ liệu từ content (nếu là Page) hoặc trực tiếp từ res.data
                const data = res.data?.content || res.data || [];
                setProducts(data);
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    return (
        <div className="container py-20">
            {/* --- TIÊU ĐỀ TRANG --- */}
            <div className="mb-40 text-center">
                <Title level={2} style={{ textTransform: 'uppercase', marginBottom: 8 }}>
                    Tất Cả Sản Phẩm
                </Title>
                <Text type="secondary">
                    Khám phá bộ sưu tập giày Sneaker mới nhất từ các thương hiệu hàng đầu
                </Text>
                <div style={{ 
                    width: '60px', 
                    height: '3px', 
                    background: 'var(--primary-color)', 
                    margin: '15px auto 0' 
                }}></div>
            </div>

            {/* --- NỘI DUNG --- */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Spin size="large" tip="Đang tải danh sách sản phẩm..." />
                </div>
            ) : (
                <div className="product-list-wrapper">
                    {products.length > 0 ? (
                        <Row gutter={[24, 24]}>
                            {products.map(product => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty 
                            image={Empty.PRESENTED_IMAGE_SIMPLE} 
                            description="Hiện chưa có sản phẩm nào được cập nhật" 
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductListPage;