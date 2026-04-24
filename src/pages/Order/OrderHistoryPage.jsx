import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Typography, Space, Spin } from 'antd';
// 👇 1. IMPORT THÊM ClockCircleOutlined
import { EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatDate } from '../../utils/format'; 
import './OrderHistoryPage.css';

const { Title } = Typography;

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderService.getOrdersByUser(user.id);
            
            if (res && Array.isArray(res.data)) {
                // Sắp xếp đơn mới nhất lên đầu
                const sortedOrders = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
            } else {
                console.warn("API không trả về mảng danh sách:", res);
                setOrders([]);
            }

        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
            setOrders([]); 
        } finally {
            setLoading(false);
        }
    };

    // 👇 2. CẬP NHẬT HÀM RENDER STATUS (ĐỒNG BỘ VỚI TRANG CHI TIẾT)
    const renderStatus = (status) => {
        // Chuyển về chữ hoa để so sánh cho chuẩn
        const normalizedStatus = status ? status.toUpperCase() : '';

        switch (normalizedStatus) {
            case 'PENDING': 
                return <Tag color="orange">Chờ thanh toán</Tag>; // Sửa thành "Chờ thanh toán" cho rõ nghĩa
            
            case 'WAITING_CONFIRM': 
                return <Tag color="geekblue" icon={<ClockCircleOutlined />}>Chờ xác nhận tiền</Tag>;
            
            case 'CONFIRMED': 
                return <Tag color="cyan">Đã xác nhận</Tag>;

            case 'SHIPPING': 
                return <Tag color="blue">Đang giao hàng</Tag>;
            
            case 'DELIVERED': 
                return <Tag color="green">Đã giao hàng</Tag>;
            
            case 'CANCELLED': 
                return <Tag color="red">Đã hủy</Tag>;
            case 'PAID': 
                return <Tag color="green">Đã thanh toán</Tag>;

            default: 
                return <Tag>{status}</Tag>;
        }
    };

    const columns = [
        { title: 'Mã đơn', dataIndex: 'id', key: 'id', render: (id) => <b>#{id}</b> },
        { 
            title: 'Ngày đặt', 
            dataIndex: 'orderDate', 
            key: 'orderDate',
            render: (date) => formatDate(date) 
        },
        { 
            title: 'Tổng tiền', 
            dataIndex: 'totalMoney', 
            key: 'totalMoney', 
            render: (price) => <span style={{ color: 'red', fontWeight: 'bold' }}>{formatPrice(price)}</span> 
        },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status', 
            align: 'center', // Căn giữa cột trạng thái cho đẹp
            render: (status) => renderStatus(status) 
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button 
                    type="primary" 
                    ghost 
                    size="small" 
                    icon={<EyeOutlined />} 
                    className="btn-view-detail" 
                    onClick={() => navigate(`/order/${record.id}`)} 
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <div className="container py-20">
            <Title level={2} style={{ marginBottom: 20 }}>Lịch sử đơn hàng</Title>
            {loading ? (
                <div style={{ textAlign: 'center', margin: '50px 0' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Table 
                    columns={columns} 
                    dataSource={orders} 
                    rowKey="id" 
                    pagination={{ pageSize: 10 }} // Tăng lên 10 đơn mỗi trang xem cho thoải mái
                    locale={{ emptyText: 'Bạn chưa có đơn hàng nào' }} 
                />
            )}
        </div>
    );
};

export default OrderHistoryPage;