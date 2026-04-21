import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Modal, Form, Input, Select, Tag, Card, Row, Col, Typography, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import userService from '../../../services/userService';
import { formatDateTime } from '../../../utils/format';

const { Text } = Typography;

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await userService.getAll();
            // Linh hoạt bóc tách dữ liệu mảng từ Backend C#
            let userArray = [];
            if (res?.data?.data) userArray = res.data.data;
            else if (res?.data) userArray = res.data;
            else if (Array.isArray(res)) userArray = res;

            setUsers(userArray);
        } catch (error) {
            console.error("Lỗi fetch API User:", error);
            message.error('Lỗi tải danh sách người dùng!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (values) => {
        try {
            if (editingUser) {
                await userService.update(editingUser.id, values);
                message.success('Cập nhật người dùng thành công!');
            } else {
                await userService.create(values);
                message.success('Thêm người dùng mới thành công!');
            }
            handleCloseModal();
            fetchData();
        } catch (error) {
            message.error('Thao tác thất bại: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        form.resetFields();
    };

    const openEditModal = (record) => {
        setIsModalOpen(true);
        setEditingUser(record);
        form.setFieldsValue({
            ...record
        });
    };

    const handleDelete = async (id) => {
        try {
            await userService.delete(id);
            message.success('Đã xóa tài khoản người dùng');
            fetchData();
        } catch (error) {
            message.error('Xóa thất bại! Có thể người dùng này đã có dữ liệu đơn hàng.');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 60, align: 'center' },
        {
            title: 'Họ tên / Tài khoản',
            key: 'userInfo',
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{record.fullName || 'Chưa cập nhật'}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>@{record.username}</Text>
                </div>
            )
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            render: (_, record) => (
                <div style={{ fontSize: '13px' }}>
                    <div><MailOutlined /> {record.email}</div>
                    {record.phone && <div><PhoneOutlined /> {record.phone}</div>}
                </div>
            )
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            width: 120,
            render: (role) => (
                <Tag color={role === 'ADMIN' ? 'volcano' : 'green'} style={{ fontWeight: 'bold' }}>
                    {role}
                </Tag>
            )
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            ellipsis: true,
            render: (address) => <Tooltip title={address}>{address || '---'}</Tooltip>
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 150,
            render: (date) => <span style={{ fontSize: '13px' }}>{formatDateTime(date)}</span>,
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Hành động',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button type="primary" ghost size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
                    <Popconfirm 
                        title="Xóa người dùng này?" 
                        description="Hành động này không thể hoàn tác!"
                        onConfirm={() => handleDelete(record.id)}
                        disabled={record.role === 'ADMIN'} // Không cho xóa Admin khác dễ dàng
                    >
                        <Button danger size="small" icon={<DeleteOutlined />} disabled={record.role === 'ADMIN'} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Quản lý người dùng</h2>
                <Button 
                    type="primary" icon={<PlusOutlined />} 
                    onClick={() => {
                        setIsModalOpen(true);
                        setEditingUser(null);
                        form.resetFields();
                    }}
                > Thêm người dùng </Button>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                bordered
                scroll={{ x: 1000 }}
                pagination={{ defaultPageSize: 10 }}
            />

            <Modal
                title={editingUser ? "Chỉnh sửa thông tin" : "Tạo tài khoản mới"}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={handleCloseModal}
                okText="Lưu thông tin"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="username" label="Tên tài khoản" rules={[{ required: true, message: 'Nhập username!' }]}>
                                <Input prefix={<UserOutlined />} placeholder="Username" disabled={!!editingUser} />
                            </Form.Item>
                        </Col>
                        {!editingUser && (
                            <Col span={12}>
                                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}>
                                    <Input.Password placeholder="Password" />
                                </Form.Item>
                            </Col>
                        )}
                        <Col span={12}>
                            <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ tên!' }]}>
                                <Input placeholder="Nguyễn Văn A" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="USER">USER</Select.Option>
                                    <Select.Option value="ADMIN">ADMIN</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                                <Input prefix={<MailOutlined />} placeholder="example@mail.com" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="phone" label="Số điện thoại">
                                <Input prefix={<PhoneOutlined />} placeholder="09xxxxxxx" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="address" label="Địa chỉ">
                                <Input.TextArea rows={2} placeholder="Nhập địa chỉ chi tiết..." />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManager;