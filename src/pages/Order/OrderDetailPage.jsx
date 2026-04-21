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
            message.error('Không thể tạo mã QR lúc này.');
        } finally {
            setRepayLoading(false);
        }
    };

    // 👇 SỬA TẠI ĐÂY: Đồng bộ trạng thái sau khi xác nhận thanh toán
    const handleConfirmPayment = async () => {
        try {
            await orderService.confirmPayment(order.id);
            setIsModalVisible(false);
            message.success('Đã gửi xác nhận! Vui lòng chờ Admin kiểm tra.');
            
            // Tải lại dữ liệu ngay lập tức để ẩn nút QR và hiện thông báo chờ xác nhận
            fetchOrderDetail(); 
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi gửi xác nhận');
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
    if (!order || !order.orderDetails) return <div className="text-center py-20">Đang tải đơn hàng...</div>;

    const currentStatus = order.status ? order.status.toUpperCase() : '';

    const columns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            width: '50%',
            render: (_, record) => (
                <div className="product-item-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Image width={60} height={60} style={{ objectFit: 'cover', borderRadius: '4px' }} src={record.product?.thumbnail || "https://placehold.co/60x60?text=No+Image"} />
                    <div>
                        <div className="product-name-link" style={{ fontWeight: 'bold', color: '#1890ff', marginBottom: '4px', cursor: 'pointer' }} onClick={() => record.product && navigate(`/product/${record.product.id}`)}>
                            {record.product?.name || "Tên sản phẩm"}
                        </div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Phân loại: {record.variant ? `${record.variant.size} - ${record.variant.color}` : "Mặc định"}
                        </Text>
                    </div>
                </div>
            )
        },
        { title: 'Đơn giá', dataIndex: 'price', align: 'right', render: (price) => formatPrice(price) },
        { title: 'Số lượng', dataIndex: 'quantity', align: 'center', render: (num) => `x${num || 0}` },
        { title: 'Thành tiền', dataIndex: 'totalMoney', align: 'right', render: (money) => <Text strong>{formatPrice(money)}</Text> }
    ];

    return (
        <div className="order-detail-container py-20">
            <div className="container detail-content-wrapper">
                <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')}>Danh sách</Button>
                    <div style={{ textAlign: 'right' }}>
                        <Title level={4} style={{ margin: 0 }}>ĐƠN HÀNG #{order.id}</Title>
                        <Text type="secondary">Đặt ngày: {formatDate(order.orderDate)}</Text>
                    </div>
                </div>

                <Row gutter={[24, 24]} className="mb-30">
                    <Col xs={24} md={12}>
                        <Card title={<><ShoppingOutlined /> Thông tin nhận hàng</>} className="info-card" variant="borderless">
                            <div className="info-row"><span className="info-label">Người nhận:</span> <span className="info-value">{order.customerName || order.fullName}</span></div>
                            <div className="info-row"><span className="info-label">SĐT:</span> <span className="info-value">{order.phoneNumber}</span></div>
                            <div className="info-row"><span className="info-label">Địa chỉ:</span> <span className="info-value">{order.address}</span></div>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title={<><CreditCardOutlined /> Thanh toán & Trạng thái</>} className="info-card" variant="borderless">
                            <div className="info-row"><span className="info-label">Phương thức:</span> <span className="info-value">{renderPaymentMethod(order.paymentMethod)}</span></div>
                            <div className="info-row"><span className="info-label">Trạng thái:</span> <span className="info-value">{renderStatus(order.status)}</span></div>
                        </Card>
                    </Col>
                </Row>

                <Table columns={columns} dataSource={order.orderDetails} rowKey="id" pagination={false} bordered className="mb-20" />

                <div className="total-section">
                    <div className="total-wrapper">
                        <div className="total-row"><Text type="secondary">Tiền hàng:</Text> <Text>{formatPrice(order.totalMoney - 30000)}</Text></div>
                        <div className="total-row"><Text type="secondary">Phí vận chuyển:</Text> <Text>{formatPrice(30000)}</Text></div>
                        <div className="total-row" style={{ marginTop: 10, borderTop: '1px solid #eee', paddingTop: 10 }}>
                            <Text strong style={{ fontSize: 16 }}>TỔNG CỘNG:</Text> <span style={{ fontSize: '20px', color: 'red', fontWeight: 'bold' }}>{formatPrice(order.totalMoney)}</span>
                        </div>

                        {/* HIỂN THỊ DỰA TRÊN STATUS ĐỂ TRÁNH THANH TOÁN 2 LẦN */}
                        {currentStatus === 'PENDING' && order.paymentMethod === 'BANK' && (
                            <div style={{ marginTop: 20, textAlign: 'right' }}>
                                <Button type="primary" size="large" icon={<QrcodeOutlined />} onClick={handleRepayment} loading={repayLoading} style={{ background: '#389e0d' }}> Lấy mã QR Thanh toán </Button>
                            </div>
                        )}

                        {currentStatus === 'WAITING_CONFIRM' && (
                            <div style={{ marginTop: 20, textAlign: 'right', padding: '15px', background: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
                                <Space align="center">
                                    <Spin size="small" />
                                    <Text strong style={{ color: '#096dd9' }}>Đang chờ Admin kiểm tra giao dịch...</Text>
                                </Space>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <VietQRModal open={isModalVisible} qrData={qrData} onClose={() => setIsModalVisible(false)} onConfirm={handleConfirmPayment} amount={order?.totalMoney} />
        </div>
    );
};

export default OrderDetailPage;