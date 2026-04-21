import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Modal, Form, Input, InputNumber, Select, Tag, Card, Row, Col, Image, Tooltip, Upload, Typography } from 'antd'; // 👈 Đã thêm Typography
import { DeleteOutlined, EditOutlined, PlusOutlined, MinusCircleOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons'; // 👈 Đã thêm UploadOutlined
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import { formatPrice, formatDateTime } from '../../../utils/format';

const { Text } = Typography; // 👈 Khai báo thẻ Text để không bị trắng trang

const UPLOAD_API_URL = 'https://localhost:7011/api/Uploads/image'; 

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); 
    
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState('');
    const [uploading, setUploading] = useState(false);

    // --- FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const [productRes, categoryRes] = await Promise.all([
                productService.getAll({ page: 0, limit: 100 }), 
                categoryService.getAll()
            ]);
            
            // Lọc mảng Product
            let pArray = [];
            if (productRes?.data?.data && Array.isArray(productRes.data.data)) pArray = productRes.data.data;
            else if (productRes?.data && Array.isArray(productRes.data)) pArray = productRes.data;
            else if (Array.isArray(productRes)) pArray = productRes;
            
            setProducts(pArray);

            // Lọc mảng Category
            let cArray = [];
            if (Array.isArray(categoryRes)) cArray = categoryRes;
            else if (Array.isArray(categoryRes?.data)) cArray = categoryRes.data;
            
            setCategories(cArray);

        } catch (error) {
            console.error("Lỗi fetch API:", error);
            message.error('Lỗi tải dữ liệu!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- LOGIC UPLOAD ẢNH CHÍNH ---
    const handleUploadChange = (info) => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done') {
            const url = info.file.response.url; 
            setPreviewImage(url);
            setUploading(false);
            form.setFieldsValue({ thumbnail: url });
            message.success('Upload ảnh thành công!');
        } else if (info.file.status === 'error') {
            setUploading(false);
            message.error('Upload thất bại. Kiểm tra lại quyền hoặc file.');
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) message.error('Chỉ hỗ trợ file JPG/PNG!');
        const isLt2M = file.size / 1024 / 1024 < 5; 
        if (!isLt2M) message.error('Ảnh phải nhỏ hơn 5MB!');
        return isJpgOrPng && isLt2M;
    };

    // --- LOGIC FORM ---
    const handleSubmit = async (values) => {
        try {
            if (editingProduct) {
                await productService.update(editingProduct.id, values);
                message.success('Cập nhật thành công!');
            } else {
                await productService.create(values);
                message.success('Thêm mới thành công!');
            }
            handleCloseModal();
            fetchData(); 
        } catch (error) {
            message.error('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setPreviewImage('');
        setUploading(false);
        form.resetFields();
    };

    const openEditModal = (record) => {
        setIsModalOpen(true);
        setEditingProduct(record);
        setPreviewImage(record.thumbnail); 
        form.setFieldsValue({
            ...record,
            categoryId: record.categoryId
        });
    };

    const handleDelete = async (id) => {
        try {
            await productService.delete(id);
            message.success('Đã xóa sản phẩm');
            fetchData();
        } catch (error) {
            message.error('Xóa thất bại');
        }
    };

    // --- TABLE COLUMNS ---
    const columns = [
        { title: 'ID', dataIndex: 'id', width: 50, align: 'center' },
        { 
            title: 'Ảnh', 
            dataIndex: 'thumbnail', 
            width: 80,
            render: (src) => (
                <Image 
                    src={src || "https://placehold.co/50x50?text=NoImg"} 
                    width={50} height={50} style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
            )
        },
        { 
            title: 'Tên sản phẩm', 
            dataIndex: 'name', 
            width: 200,
            render: (text, record) => (
                <div>
                    <strong>{text}</strong>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: 4 }}>
                        {record.variants?.map((v, index) => (
                            <Tag key={v.id || index} style={{ marginRight: 2, fontSize: '10px' }}>
                                {v.size}/{v.color} ({v.stock})
                            </Tag>
                        ))}
                    </div>
                </div>
            ) 
        },
        { 
            title: 'Giá', 
            dataIndex: 'price', 
            width: 100, 
            render: (p) => <span style={{color:'green', fontWeight: 'bold'}}>{formatPrice(p)}</span> 
        },
        { 
            title: 'Danh mục', 
            dataIndex: 'category', 
            width: 120,
            render: (cate, record) => {
                const cateName = cate?.name || categories.find(c => c.id === record.categoryId)?.name;
                return <Tag color="blue">{cateName || '---'}</Tag>
            }
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            width: 150,
            ellipsis: { showTitle: false },
            render: (desc) => (
                <Tooltip placement="topLeft" title={desc}>
                    {desc || <span style={{color: '#ccc'}}>Chưa có mô tả</span>}
                </Tooltip>
            ),
        },
        { 
            title: 'Ngày tạo', 
            dataIndex: 'createdAt', 
            width: 110,
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
                    <Popconfirm title="Xóa sản phẩm này?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const uploadButton = (
        <div>
            {uploading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
        </div>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Quản lý sản phẩm</h2>
                <Button 
                    type="primary" icon={<PlusOutlined />} 
                    onClick={() => {
                        setIsModalOpen(true);
                        setEditingProduct(null);
                        setPreviewImage('');
                        setUploading(false);
                        form.resetFields();
                    }}
                > Thêm mới </Button>
            </div>

            <Table 
                columns={columns} 
                dataSource={products} 
                rowKey="id" 
                loading={loading} 
                bordered 
                scroll={{ x: 1300 }} 
                pagination={{ defaultPageSize: 5 }}
            />

            <Modal
                title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={handleCloseModal}
                width={1000} // Nới rộng form một chút cho đẹp
                okText="Lưu lại"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Card title="Thông tin chung" size="small" style={{ marginBottom: 20 }}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Nhập tên!' }]}>
                                            <Input placeholder="VD: Nike Air Force 1" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Chọn danh mục!' }]}>
                                            <Select placeholder="Chọn danh mục">
                                                {categories.map((cate) => (
                                                    <Select.Option key={cate.id} value={cate.id}>{cate.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="price" label="Giá bán" rules={[{ required: true, message: 'Nhập giá!' }]}>
                                            <InputNumber 
                                                style={{ width: '100%' }} 
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Ảnh đại diện">
                                            <Form.Item name="thumbnail" noStyle><Input type="hidden" /></Form.Item>
                                            <Upload
                                                name="file"
                                                listType="picture-card"
                                                showUploadList={false}
                                                action={UPLOAD_API_URL}
                                                beforeUpload={beforeUpload}
                                                onChange={handleUploadChange}
                                                headers={{
                                                    Authorization: `Bearer ${localStorage.getItem('token')}`
                                                }}
                                            >
                                                {previewImage ? (
                                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                                        <img src={previewImage} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                        <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.5)', color: '#fff', textAlign: 'center', fontSize: '10px' }}> Đổi ảnh </div>
                                                    </div>
                                                ) : uploadButton}
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ border: '1px dashed #d9d9d9', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Xem trước ảnh lớn</Text>
                                    <Image width={150} height={150} src={previewImage || "https://placehold.co/150x150?text=No+Image"} style={{ objectFit: 'contain' }} />
                                </div>
                            </Col>
                            <Col span={24}>
                                <Form.Item name="description" label="Mô tả chi tiết">
                                    <Input.TextArea rows={3} placeholder="Mô tả sản phẩm..." />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Phân loại hàng (Size/Màu/Tồn kho)" size="small">
                        <Form.List name="variants">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Row key={key} gutter={8} align="middle" style={{ marginBottom: 12, background: '#fafafa', padding: '12px', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
                                            <Col span={4}>
                                                <Form.Item {...restField} name={[name, 'size']} rules={[{ required: true, message: 'Nhập Size!' }]} label="Size">
                                                    <InputNumber style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={5}>
                                                <Form.Item {...restField} name={[name, 'color']} rules={[{ required: true, message: 'Nhập Màu!' }]} label="Màu sắc">
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item {...restField} name={[name, 'stock']} rules={[{ required: true, message: 'Nhập SL!' }]} label="Tồn kho">
                                                    <InputNumber style={{ width: '100%' }} />
                                                </Form.Item>
                                            </Col>
                                            
                                            {/* Phần Upload Ảnh Riêng Cho Biến Thể */}
                                            <Col span={9}>
                                                <Form.Item label="Ảnh biến thể">
                                                    <Space align="start">
                                                        <Form.Item {...restField} name={[name, 'imageUrl']} noStyle>
                                                            <Input placeholder="Tải ảnh lên..." readOnly style={{ width: '140px' }} />
                                                        </Form.Item>
                                                        <Upload
                                                            name="file"
                                                            showUploadList={false}
                                                            action={UPLOAD_API_URL}
                                                            headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
                                                            beforeUpload={beforeUpload}
                                                            onChange={(info) => {
                                                                if (info.file.status === 'done') {
                                                                    const url = info.file.response.url;
                                                                    const currentVariants = form.getFieldValue('variants');
                                                                    currentVariants[name].imageUrl = url;
                                                                    form.setFieldsValue({ variants: currentVariants });
                                                                    message.success('Tải ảnh biến thể thành công!');
                                                                }
                                                            }}
                                                        >
                                                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                                                        </Upload>
                                                        {/* Xem trước ảnh nhỏ */}
                                                        <Form.Item shouldUpdate noStyle>
                                                            {() => {
                                                                const url = form.getFieldValue(['variants', name, 'imageUrl']);
                                                                return url ? <Image src={url} width={32} height={32} style={{ borderRadius: 4, objectFit: 'cover' }} /> : null;
                                                            }}
                                                        </Form.Item>
                                                    </Space>
                                                </Form.Item>
                                            </Col>
                                            <Col span={2} style={{ textAlign: 'center', paddingTop: '24px' }}>
                                                <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }} />
                                            </Col>
                                        </Row>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}> Thêm phân loại hàng mới </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Card>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManager;