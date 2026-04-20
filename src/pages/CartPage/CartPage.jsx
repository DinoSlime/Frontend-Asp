import React, { useContext } from 'react';
import { Table, Typography, Button, InputNumber, Row, Col, Card, Divider, Image, Popconfirm, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import './CartPage.css';

const { Title, Text } = Typography;

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, totalItems } = useContext(CartContext);
    const navigate = useNavigate();

    // Tính tổng tiền tạm tính
    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Cấu hình các cột cho bảng
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            width: '40%',
            render: (_, record) => (
                <div className="cart-product-info">
                    <Image src={record.thumbnail} className="cart-product-img" alt={record.name} />
                    <div>
                        <Text strong style={{ fontSize: 16, display: 'block' }}>{record.name}</Text>
                        <Text type="secondary">Phân loại: Size {record.size}</Text>
                        {record.color && <Text type="secondary"> - Màu {record.color}</Text>}
                    </div>
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => <Text strong>{formatPrice(price)}</Text>,
            responsive: ['md'], // Ẩn trên mobile cho gọn
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, record) => (
                <InputNumber
                    min={1}
                    max={10} // Có thể check tồn kho ở đây nếu muốn
                    value={record.quantity}
                    onChange={(value) => {
                        if (value) updateQuantity(record.id, record.variantId, value);
                    }}
                />
            ),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (_, record) => (
                <Text type="danger" strong>
                    {formatPrice(record.price * record.quantity)}
                </Text>
            ),
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Popconfirm 
                    title="Bạn có chắc muốn xóa?" 
                    onConfirm={() => {
                        removeFromCart(record.id, record.variantId);
                        message.success('Đã xóa sản phẩm khỏi giỏ');
                    }}
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            ),
        },
    ];

    // Giao diện khi giỏ hàng trống
    if (cartItems.length === 0) {
        return (
            <div className="container py-20" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Empty description="Giỏ hàng của bạn đang trống" />
                <Button type="primary" size="large" onClick={() => navigate('/')} style={{ marginTop: 20 }}>
                    Tiếp tục mua sắm
                </Button>
            </div>
        );
    }

    return (
        <div className="cart-page-container py-20">
            <div className="container">
                <Title level={2} style={{ marginBottom: 20 }}>
                    <ShoppingOutlined /> Giỏ hàng ({totalItems} sản phẩm)
                </Title>

                <Row gutter={24}>
                    {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
                    <Col xs={24} lg={16}>
                        <Table
                            className="cart-table"
                            columns={columns}
                            dataSource={cartItems}
                            rowKey={(record) => `${record.id}-${record.variantId}`} // Key duy nhất = ID SP + ID Variant
                            pagination={false}
                            scroll={{ x: 600 }} // Cho phép cuộn ngang trên mobile
                        />
                    </Col>

                    {/* --- CỘT PHẢI: TỔNG TIỀN & THANH TOÁN --- */}
                    <Col xs={24} lg={8}>
                        <Card className="cart-summary-card" title="Cộng giỏ hàng">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text>Tạm tính:</Text>
                                <Text strong>{formatPrice(subTotal)}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text>Giảm giá:</Text>
                                <Text>0 ₫</Text>
                            </div>
                            
                            <Divider style={{ margin: '15px 0' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong style={{ fontSize: 18 }}>Tổng cộng:</Text>
                                <Text type="danger" strong style={{ fontSize: 20 }}>
                                    {formatPrice(subTotal)}
                                </Text>
                            </div>

                            <Button 
                                type="primary" 
                                block 
                                className="checkout-btn"
                                icon={<ArrowRightOutlined />}
                                onClick={() => navigate('/checkout')} // Sẽ làm trang này sau
                            >
                                TIẾN HÀNH ĐẶT HÀNG
                            </Button>

                            <div style={{ marginTop: 15, textAlign: 'center' }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    (Đã bao gồm VAT nếu có)
                                </Text>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CartPage;