import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Table, Tag, Button, Spin, Image, message, Divider, Space } from 'antd'; 
import { ArrowLeftOutlined, ShoppingOutlined, CreditCardOutlined, QrcodeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import orderService from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/format';
import paymentService from '../../services/paymentService';
import VietQRModal from '../../components/Payment/VietQRModal';

import './OrderDetailPage.css';

const { Title, Text } = Typography;

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [repayLoading, setRepayLoading] = useState(false);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            const res = await orderService.getOrderById(id);
            // Có thể res.data lồng nhau tùy cấu trúc API
            const orderData = res.data?.data || res.data;
            setOrder(orderData);
        } catch (error) {
            console.error(error);
            message.error('Không tải được thông tin đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleRepayment = async () => {
        setRepayLoading(true);
        try {
            const qrRes = await paymentService.createVietQR(order);
            setQrData(qrRes.data);
            setIsModalVisible(true);
        } catch (error) {
            console.error(error);
            message.error('Không thể tạo mã QR lúc này. Vui lòng thử lại sau.');
        } finally {
            setRepayLoading(false);
        }
    };

    const handleConfirmPayment = async () => {
        try {
            await orderService.updateOrderStatus(order.id, 'WAITING_CONFIRM'); 
            setIsModalVisible(false);
            message.success('Đã gửi xác nhận! Vui lòng chờ Admin kiểm tra.');
            fetchOrderDetail(); 
        } catch (error) {
            console.error(error);
            setIsModalVisible(false); 
            fetchOrderDetail(); 
        }
    };

    const renderStatus = (status) => {
        const normalizedStatus = status ? status.toUpperCase() : '';
        switch (normalizedStatus) {
            case 'PENDING': return <Tag color="orange">Chờ thanh toán</Tag>;
            case 'WAITING_CONFIRM': return <Tag color="geekblue" icon={<ClockCircleOutlined />}>Chờ xác nhận giao dịch</Tag>;
            case 'CONFIRMED': return <Tag color="cyan">Đã xác nhận</Tag>;
            case 'SHIPPING': return <Tag color="blue">Đang giao hàng</Tag>;
            case 'DELIVERED': return <Tag color="green">Đã giao hàng</Tag>;
            case 'CANCELLED': return <Tag color="red">Đã hủy</Tag>;
            default: return <Tag>{status}</Tag>;
        }
    };

    const renderPaymentMethod = (method) => {
        if (method === 'COD') return <Tag color="cyan">Thanh toán khi nhận hàng (COD)</Tag>;
        if (method === 'BANK') return <Tag color="geekblue">Chuyển khoản ngân hàng</Tag>;
        return <Tag>{method}</Tag>;
    };

    if (loading) return <div className="spinner-center"><Spin size="large" /></div>;
    if (!order || !order.orderDetails) return <div className="text-center py-20">Đang tải hoặc lỗi dữ liệu đơn hàng...</div>;

    const currentStatus = order.status ? order.status.toUpperCase() : '';

    const columns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            width: '50%',
            render: (_, record) => (
                <div className="product-item-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Image 
                        width={60} 
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                        src={record.product?.thumbnail || "https://placehold.co/60x60?text=No+Image"} 
                        className="product-thumb"
                    />
                    <div>
                        <div 
                              className="product-name-link cursor-pointer"
                              style={{ fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}
                              onClick={() => record.product && navigate(`/product/${record.product.id}`)} 
                        >
                            {record.product?.name || "Tên sản phẩm trống"}
                        </div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Phân loại: {record.variant ? `${record.variant.size} - ${record.variant.color}` : "Mặc định"}
                        </Text>
                    </div>
                </div>
            )
        },
        { 
            title: 'Đơn giá', 
            dataIndex: 'price', 
            align: 'right',
            render: (price) => formatPrice(price) 
        },
        { 
            title: 'Số lượng', 
            dataIndex: 'quantity', // 👇 Đã sửa từ numberOfProducts thành quantity
            align: 'center',
            render: (num) => `x${num || 0}`
        },
        { 
            title: 'Thành tiền', 
            dataIndex: 'totalMoney', 
            align: 'right',
            render: (money) => <Text strong>{formatPrice(money)}</Text>
        }
    ];

    return (
        <div className="order-detail-container py-20">
            <div className="container detail-content-wrapper">
                <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')}>
                            Quay lại danh sách
                        </Button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <Title level={4} style={{ margin: 0 }}>ĐƠN HÀNG #{order.id}</Title>
                        <Text type="secondary">Đặt ngày: {formatDate(order.orderDate)}</Text>
                    </div>
                </div>

                <Row gutter={[24, 24]} className="mb-30">
                    <Col xs={24} md={12}>
                        <Card 
                            title={<><ShoppingOutlined /> Thông tin nhận hàng</>} 
                            className="info-card" 
                            variant="borderless"
                        >
                            <div className="info-row"><span className="info-label">Người nhận:</span> <span className="info-value">{order.customerName || order.fullName}</span></div>
                            <div className="info-row"><span className="info-label">Số điện thoại:</span> <span className="info-value">{order.phoneNumber}</span></div>
                            <div className="info-row"><span className="info-label">Địa chỉ:</span> <span className="info-value">{order.address}</span></div>
                            <div className="info-row"><span className="info-label">Ghi chú:</span> <span className="info-value">{order.note || 'Không có'}</span></div>
                        </Card>
                    </Col>
                    
                    <Col xs={24} md={12}>
                        <Card 
                            title={<><CreditCardOutlined /> Thanh toán & Trạng thái</>} 
                            className="info-card" 
                            variant="borderless"
                        >
                            <div className="info-row"><span className="info-label">Phương thức:</span> <span className="info-value">{renderPaymentMethod(order.paymentMethod)}</span></div>
                            <div className="info-row"><span className="info-label">Trạng thái:</span> <span className="info-value">{renderStatus(order.status)}</span></div>
                        </Card>
                    </Col>
                </Row>

                <Table 
                    columns={columns} 
                    dataSource={order.orderDetails} 
                    rowKey="id" 
                    pagination={false} 
                    bordered
                    className="mb-20"
                />

                <div className="total-section">
                    <div className="total-wrapper">
                        <div className="total-row"><Text type="secondary">Tổng tiền hàng:</Text> <Text>{formatPrice(order.totalMoney - 30000)}</Text></div>
                        <div className="total-row"><Text type="secondary">Phí vận chuyển:</Text> <Text>{formatPrice(30000)}</Text></div>
                        <div className="total-row" style={{ marginTop: 10, borderTop: '1px solid #eee', paddingTop: 10 }}>
                            <Text strong style={{ fontSize: 16 }}>TỔNG CỘNG:</Text> <span className="final-price" style={{ fontSize: '20px', color: 'red', fontWeight: 'bold' }}>{formatPrice(order.totalMoney)}</span>
                        </div>

                        {currentStatus === 'PENDING' && order.paymentMethod === 'BANK' && (
                            <div style={{ marginTop: 20, textAlign: 'right' }}>
                                <Button type="primary" size="large" icon={<QrcodeOutlined />} onClick={handleRepayment} loading={repayLoading} style={{ background: '#389e0d', borderColor: '#389e0d' }}> Lấy mã QR Thanh toán </Button>
                                <div style={{ marginTop: 5 }}><Text type="secondary" style={{ fontSize: 12 }}>(Vui lòng thanh toán để chúng tôi giao hàng sớm nhất)</Text></div>
                            </div>
                        )}

                        {currentStatus === 'WAITING_CONFIRM' && (
                            <div style={{ marginTop: 20, textAlign: 'right', padding: '15px', background: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
                                <Space align="center">
                                    <Spin size="small" />
                                    <Text strong type="secondary" style={{ color: '#096dd9' }}>Đã nhận yêu cầu. Admin đang kiểm tra giao dịch...</Text>
                                </Space>
                                <div style={{ marginTop: 5 }}><Text type="secondary" style={{ fontSize: 12 }}>Trạng thái sẽ được cập nhật sau 5-10 phút.</Text></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <VietQRModal 
    open={isModalVisible}
    qrData={qrData}
    onClose={() => setIsModalVisible(false)}
    onConfirm={handleConfirmPayment}
    amount={order?.totalMoney} // <-- PHẢI CÓ DÒNG NÀY
/>
        </div>
    );
};

export default OrderDetailPage;