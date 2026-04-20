import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, Space, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import categoryService from '../../../services/categoryService';
import { formatPrice, formatDate, formatDateTime } from '../../../utils/format';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await categoryService.getAll();
            // Backend trả về List thì lấy data, trả về Page thì lấy content
            setCategories(res.data.content || res.data || []);
        } catch (error) {
            message.error('Lỗi tải danh mục!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (values) => {
        try {
            if (editingCategory) {
                await categoryService.update(editingCategory.id, values);
                message.success('Cập nhật thành công!');
            } else {
                await categoryService.create(values);
                message.success('Thêm mới thành công!');
            }
            setIsModalOpen(false);
            setEditingCategory(null);
            form.resetFields();
            fetchCategories();
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await categoryService.delete(id);
            message.success('Đã xóa danh mục');
            fetchCategories();
        } catch (error) {
            message.error('Xóa thất bại (Có thể danh mục đang chứa sản phẩm)');
        }
    };

    const openEditModal = (record) => {
        setEditingCategory(record);
        setIsModalOpen(true);
        form.setFieldsValue({ name: record.name });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 80 },
        { 
            title: 'Tên danh mục', 
            dataIndex: 'name', 
            render: (text) => <strong>{text}</strong>
        },
        { 
                    title: 'Ngày tạo', 
                    dataIndex: 'createdAt', 
                    width: 110,
                    render: (date) => <span style={{ fontSize: '13px' }}>{formatDateTime(date)}</span>,
                    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), 
                },
                
                { 
                    title: 'Cập nhật', 
                    dataIndex: 'updatedAt', 
                    width: 110,
                    render: (date) => <span style={{ fontSize: '13px', color: '#888' }}>{formatDateTime(date)}</span>,
                    sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
                },
        {
            title: 'Hành động',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary" ghost icon={<EditOutlined />} 
                        onClick={() => openEditModal(record)} 
                    />
                    <Popconfirm title="Xóa danh mục này?" onConfirm={() => handleDelete(record.id)} okText="Có" cancelText="Không">
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Quản lý danh mục</h2>
                <Button 
                    type="primary" icon={<PlusOutlined />} 
                    onClick={() => {
                        setEditingCategory(null);
                        form.resetFields();
                        setIsModalOpen(true);
                    }}
                >
                    Thêm danh mục
                </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={categories} 
                rowKey="id" 
                loading={loading} 
                bordered 
                pagination={{ defaultPageSize: 10 }}
            />

            <Modal
                title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item 
                        name="name" 
                        label="Tên danh mục" 
                        rules={[{ required: true, message: 'Không được để trống!' }]}
                    >
                        <Input placeholder="Ví dụ: Nike, Adidas..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManager;