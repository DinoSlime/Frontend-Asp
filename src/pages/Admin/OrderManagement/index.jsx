import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, message, Typography, Space, Badge } from 'antd'; // Thêm Badge
import orderService from '../../../services/orderService';
import { formatPrice, formatDate } from '../../../utils/format';

const { Title } = Typography;
const { Option } = Select;

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const res = await orderService.getAllOrders();
            if (res && Array.isArray(res.data)) {
                // Sắp xếp đơn mới nhất lên đầu
                const sortedOrders = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
            }
        } catch (error) {
            message.error("Lỗi tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi Admin đổi trạng thái
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            message.success(`Đã cập nhật trạng thái đơn #${orderId} thành công`);
            fetchAllOrders();
        } catch (error) {
            message.error("Cập nhật thất bại");
        }
    };

    // Hàm render màu sắc cho phương thức thanh toán (Đồng bộ với User)
    const renderPaymentMethod = (method) => {
        if (method === 'COD') return <Tag color="cyan">Thanh toán khi nhận (COD)</Tag>;
        if (method === 'BANK') return <Tag color="geekblue">Chuyển khoản</Tag>;
        return <Tag>{method}</Tag>;
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 60, render: (id) => <b>#{id}</b> },
        { 
            title: 'Khách hàng', 
            dataIndex: 'fullName',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    <small style={{ color: '#888' }}>{record.phoneNumber}</small>
                </div>
            )
        },
        { title: 'Ngày đặt', dataIndex: 'orderDate', render: (date) => formatDate(date) },
        { 
            title: 'Tổng tiền', 
            dataIndex: 'totalMoney', 
            render: (money) => <b style={{ color: 'red' }}>{formatPrice(money)}</b> 
        },
        { 
            title: 'Thanh toán', 
            dataIndex: 'paymentMethod',
            render: (method) => renderPaymentMethod(method)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                // Logic màu sắc cho viền Select để Admin dễ nhận diện đơn cần xử lý gấp
                let statusColor = '';
                if (status === 'WAITING_CONFIRM') statusColor = 'blue'; 
                if (status === 'CANCELLED') statusColor = 'error';
                if (status === 'DELIVERED') statusColor = 'success';

                return (
                    <Select
                        defaultValue={status}
                        style={{ width: 180 }} // Tăng độ rộng
                        onChange={(value) => handleStatusChange(record.id, value)}
                        status={statusColor} 
                    >
                        {/* 👇 ĐỒNG BỘ TIẾNG VIỆT VÀ TRẠNG THÁI VỚI APP USER */}
                        
                        <Option value="PENDING">
                            <Badge status="warning" text="Chờ thanh toán" />
                        </Option>
                        
                        {/* 👇 QUAN TRỌNG: Admin cần thấy cái này để duyệt tiền */}
                        <Option value="WAITING_CONFIRM">
                            <Badge status="processing" text="Chờ xác nhận tiền" />
                        </Option>

                        <Option value="CONFIRMED">
                            <Badge status="default" text="Đã xác nhận" />
                        </Option>
                        
                        <Option value="SHIPPING">
                            <Badge color="blue" text="Đang giao hàng" />
                        </Option>
                        
                        <Option value="DELIVERED">
                            <Badge status="success" text="Đã giao hàng" />
                        </Option>
                        
                        <Option value="CANCELLED">
                            <Badge status="error" text="Đã hủy" />
                        </Option>
                        <Option value="PAID">
                            <Badge status="success" text="Đã thanh toán" />
                        </Option>
                    </Select>
                );
            },
        },
    ];

    return (
        <div>
            <Title level={3}>Quản lý Đơn hàng</Title>
            <Table 
                dataSource={orders} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default OrderManagement;