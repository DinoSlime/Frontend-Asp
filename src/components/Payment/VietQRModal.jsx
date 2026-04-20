import React from 'react';
import { Modal, Typography, Button, Space, Divider, message } from 'antd';
import { CheckCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { formatPrice } from '../../utils/format';

const { Title, Text } = Typography;

const VietQRModal = ({ open, onClose, qrData, onConfirm }) => {
    
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        message.success('Đã sao chép nội dung chuyển khoản!');
    };

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0,textAlign: 'center', width: '100%'
             }}>Thanh toán chuyển khoản VietQR</Title>}
            open={open}
            onCancel={onClose} // Hàm này sẽ được gọi khi bấm nút X hoặc bấm ra ngoài
            closable={true}    // 👇 Đổi thành true để hiện nút X
            maskClosable={true} // 👇 Cho phép bấm ra vùng mờ để thoát
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
                        src={qrData.qrCodeUrl} 
                        alt="VietQR" 
                        style={{ width: '100%', maxWidth: 280, marginBottom: 15, borderRadius: '8px', border: '1px solid #f0f0f0' }} 
                    />

                    <div style={{ padding: '16px', background: '#fafafa', borderRadius: '12px', border: '1px dashed #d9d9d9' }}>
                        <Space direction="vertical" size={2} style={{ width: '100%' }}>
                            <Text type="secondary">Số tiền cần thanh toán</Text>
                            <Text strong type="danger" style={{ fontSize: 28 }}>
                                {formatPrice(qrData.totalAmount)}
                            </Text>
                        </Space>
                        
                        <Divider style={{ margin: '12px 0' }} />
                        
                        <Space direction="vertical" size={2} style={{ width: '100%' }}>
                            <Text type="secondary">Nội dung chuyển khoản</Text>
                            <Space>
                                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{qrData.description}</Text>
                                <Button 
                                    type="text" 
                                    icon={<CopyOutlined />} 
                                    onClick={() => handleCopy(qrData.description)} 
                                />
                            </Space>
                        </Space>
                    </div>

                    <div style={{ marginTop: 20, textAlign: 'left', padding: '0 10px' }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
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