import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Button, Radio, Typography, Card, Divider, message, Space } from 'antd'; 
import { DollarOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/format';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import VietQRModal from '../../components/Payment/VietQRModal'; 

import './CheckoutPage.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [createdOrderId, setCreatedOrderId] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const { cartItems, clearCart } = useContext(CartContext);
    const { user } = useAuth();

    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 30000; 
    const finalTotal = subTotal + shippingFee;

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName || user.username,
                phone: user.phone || '', 
                address: user.address || ''
            });
        }
    }, [user, form]);

    useEffect(() => {
        if (cartItems.length === 0 && !isModalVisible && !isSuccess) {
            navigate('/cart');
        }
    }, [cartItems, navigate, isModalVisible, isSuccess]);

    // 👇 SỬA TẠI ĐÂY: Hàm xác nhận ngay trên Checkout
    const handleConfirmPayment = async () => {
        try {
            setLoading(true);
            if (createdOrderId) {
                // Gọi hàm confirmPayment dành cho User thay vì hàm admin update status
                await orderService.confirmPayment(createdOrderId);
            }
            
            setIsSuccess(true); 
            setIsModalVisible(false);
            clearCart(); 
            message.success('Đã nhận yêu cầu thanh toán! Đang chuyển đến chi tiết đơn hàng.');
            
            // Chuyển hướng thẳng vào trang chi tiết đơn hàng vừa tạo
            setTimeout(() => {
                navigate(`/order/${createdOrderId}`);
            }, 300);
        } catch (error) {
            console.error(error);
            setIsSuccess(true);
            setIsModalVisible(false);
            clearCart();
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsSuccess(true); 
        setIsModalVisible(false);
        clearCart(); 
        message.info('Đơn hàng đã được tạo. Bạn có thể thanh toán sau trong Lịch sử đơn hàng.');
        setTimeout(() => { navigate('/orders'); }, 100);
    };

    const handlePlaceOrder = async (values) => {
        setLoading(true);
        try {
            const orderData = {
                fullName: values.fullName,
                phoneNumber: values.phone,
                address: values.address,
                note: values.note,
                paymentMethod: values.paymentMethod,
                totalMoney: finalTotal,
                userId: user ? user.id : 0,
                orderDetails: cartItems.map(item => ({
                    productId: item.id,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const res = await orderService.createOrder(orderData);
            const createdOrder = res.data; 
            setCreatedOrderId(createdOrder.id);

            if (values.paymentMethod === 'BANK') {
                try {
                    const qrRes = await paymentService.createVietQR(createdOrder);
                    setQrData(qrRes.data);
                    setIsModalVisible(true);
                } catch (err) {
                    message.warning('Lỗi lấy QR. Vui lòng kiểm tra lại đơn hàng.');
                    setIsSuccess(true);
                    clearCart();
                    navigate('/orders');
                }
            } else {
                setIsSuccess(true);
                message.success('Đặt hàng thành công!');
                clearCart(); 
                setTimeout(() => { navigate('/orders'); }, 100);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Đặt hàng thất bại!';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !isModalVisible && !isSuccess) return null;

    return (
        <div className="checkout-container py-20">
            <div className="container">
                <Title level={2} style={{ marginBottom: 20, textAlign: 'center' }}>THANH TOÁN</Title>
                <Form form={form} layout="vertical" onFinish={handlePlaceOrder} initialValues={{ paymentMethod: 'COD' }}>
                    <Row gutter={24}>
                        <Col xs={24} md={14}>
                            <Card title="Thông tin giao hàng" className="checkout-card mb-20">
                                <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
                                    <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" size="large" />
                                </Form.Item>
                                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập SĐT' }, { pattern: /^[0-9]{10}$/, message: 'SĐT không hợp lệ' }]}>
                                    <Input prefix={<PhoneOutlined />} placeholder="0987..." size="large" />
                                </Form.Item>
                                <Form.Item name="address" label="Địa chỉ nhận hàng" rules={[{ required: true, message: 'Nhập địa chỉ' }]}>
                                    <TextArea rows={3} placeholder="Số nhà, đường..." />
                                </Form.Item>
                                <Form.Item name="note" label="Ghi chú">
                                    <TextArea rows={2} placeholder="Ví dụ: Giao giờ hành chính..." />
                                </Form.Item>
                            </Card>

                            <Card title="Phương thức thanh toán" className="checkout-card">
                                <Form.Item name="paymentMethod" noStyle>
                                    <Radio.Group className="payment-method-radio w-100">
                                        <Space direction="vertical" className="w-100">
                                            <Radio value="COD" className="payment-radio-item">
                                                <Text strong>Thanh toán khi nhận hàng (COD)</Text><br/>
                                                <Text type="secondary" style={{ fontSize: 12 }}>Nhận hàng rồi mới trả tiền.</Text>
                                            </Radio>
                                            <Radio value="BANK" className="payment-radio-item">
                                                <Text strong>Chuyển khoản ngân hàng (VietQR)</Text><br/>
                                                <Text type="secondary" style={{ fontSize: 12 }}>Quét mã QR để thanh toán nhanh chóng.</Text>
                                            </Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Card>
                        </Col>

                        <Col xs={24} md={10}>
                            <Card title="Đơn hàng của bạn" className="checkout-card summary-card">
                                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: 15 }}>
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="order-summary-item">
                                            <div style={{ display: 'flex', gap: 10 }}>
                                                <img src={item.thumbnail} alt="prod" className="summary-img" />
                                                <div>
                                                    <Text strong style={{ fontSize: 14, display: 'block' }}>{item.name}</Text>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>Size: {item.size} | x{item.quantity}</Text>
                                                </div>
                                            </div>
                                            <Text strong>{formatPrice(item.price * item.quantity)}</Text>
                                        </div>
                                    ))}
                                </div>
                                <Divider />
                                <div className="total-row">
                                    <Text type="secondary">Tạm tính:</Text>
                                    <Text>{formatPrice(subTotal)}</Text>
                                </div>
                                <div className="total-row">
                                    <Text type="secondary">Phí vận chuyển:</Text>
                                    <Text>{formatPrice(shippingFee)}</Text>
                                </div>
                                <Divider style={{ margin: '15px 0' }} />
                                <div className="total-row" style={{ alignItems: 'center' }}>
                                    <Text strong style={{ fontSize: 18 }}>Tổng cộng:</Text>
                                    <Text type="danger" strong style={{ fontSize: 24 }}>{formatPrice(finalTotal)}</Text>
                                </div>
                                <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ marginTop: 25, height: 50, fontSize: 18, fontWeight: 'bold' }} icon={<DollarOutlined />}>
                                    ĐẶT HÀNG
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </Form>

                <VietQRModal 
                    open={isModalVisible}
                    qrData={qrData}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmPayment}
                    amount={finalTotal}
                />
            </div>
        </div>
    );
};

export default CheckoutPage;