import React, { useEffect } from 'react';
import { Modal, Typography, Button, Space, Divider, message } from 'antd';
import { CheckCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { formatPrice } from '../../utils/format';

const { Title, Text } = Typography;

const VietQRModal = ({ open, onClose, qrData, onConfirm, amount }) => {
    
    // 👇 BẬT F12 LÊN ĐỂ XEM DÒNG NÀY IN RA CÁI GÌ
    useEffect(() => {
        if (open) {
            console.log("==== KIỂM TRA DỮ LIỆU QR ====");
            console.log("1. Số tiền từ trang cha truyền vào (amount):", amount);
            console.log("2. Cục data Backend trả về (qrData):", qrData);
        }
    }, [open, amount, qrData]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        message.success('Đã sao chép nội dung chuyển khoản!');
    };

    // Quét sạch mọi biến có thể chứa tiền
    const displayAmount = amount || qrData?.totalMoney || qrData?.totalAmount || qrData?.amount || qrData?.price || 0;

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0,textAlign: 'center', width: '100%' }}>Thanh toán chuyển khoản VietQR</Title>}
            open={open}
            onCancel={onClose} 
            closable={true}    
            maskClosable={true} 
            footer={[
                <Button 
                    key="confirm" 
                    type="primary" 
                    size="large" 
                    block 
                    onClick={onConfirm} 
                    icon={<CheckCircleOutlined />}
                    style={{ height: '50px', fontSize: '16px', fontWeight: 'bold' }}
                >
                    TÔI ĐÃ CHUYỂN TIỀN
                </Button>
            ]}
        >
            {qrData ? (
                <div style={{ textAlign: 'center' }}>
                    <img 
                        src={qrData.qrCodeUrl || qrData.qrCode} // Đề phòng backend trả về tên biến khác
                        alt="VietQR" 
                        style={{ width: '100%', maxWidth: 280, marginBottom: 15, borderRadius: '8px', border: '1px solid #f0f0f0' }} 
                    />

                    <div style={{ padding: '16px', background: '#fafafa', borderRadius: '12px', border: '1px dashed #d9d9d9' }}>
                        <Space direction="vertical" size={2} style={{ width: '100%' }}>
                            <Text type="secondary">Số tiền cần thanh toán</Text>
                            <Text strong type="danger" style={{ fontSize: 28 }}>
                                {formatPrice(displayAmount)}
                            </Text>
                            {/* Dòng hiển thị miễn phí vận chuyển */}
                            <Text type="success" style={{ fontSize: 15, fontWeight: 'bold' }}>
                                ✨ Đã áp dụng Miễn phí vận chuyển!
                            </Text>
                        </Space>
                        
                        <Divider style={{ margin: '12px 0' }} />
                        
                        <Space direction="vertical" size={2} style={{ width: '100%' }}>
                            <Text type="secondary">Nội dung chuyển khoản</Text>
                            <Space>
                                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{qrData.description || qrData.content}</Text>
                                <Button 
                                    type="text" 
                                    icon={<CopyOutlined />} 
                                    onClick={() => handleCopy(qrData.description || qrData.content)} 
                                />
                            </Space>
                        </Space>
                    </div>

                    <div style={{ marginTop: 20, textAlign: 'left', padding: '0 10px' }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            • Đơn hàng của bạn được <b>miễn phí giao hàng</b> toàn quốc.<br />
                            • Sử dụng ứng dụng Ngân hàng để quét mã QR.<br />
                            • Kiểm tra kỹ <b>Số tiền</b> và <b>Nội dung</b> trước khi chuyển.<br />
                            • Sau khi chuyển xong, hãy nhấn nút bên dưới để hoàn tất.
                        </Text>
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải thông tin thanh toán...</div>
            )}
        </Modal>
    );
};

export default VietQRModal;