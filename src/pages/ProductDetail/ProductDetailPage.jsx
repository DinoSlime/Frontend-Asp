import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button, Rate, Radio, InputNumber, message, Image, Spin, Divider, Tag, Space } from 'antd';
import { ShoppingCartOutlined, ThunderboltOutlined, CheckCircleOutlined } from '@ant-design/icons';
import productService from '../../services/productService';
import { formatPrice } from '../../utils/format';
import { CartContext } from '../../context/CartContext';
import './ProductDetailPage.css';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext); 

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // --- STATE QUẢN LÝ SIZE / MÀU ---
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null); // Thêm state Màu
    const [quantity, setQuantity] = useState(1);
    
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]); // List màu theo size
    
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        fetchProductDetail();
        window.scrollTo(0, 0); 
    }, [id]);

    // Khi chọn Size -> Lọc ra các màu tương ứng của size đó
    useEffect(() => {
        if (product && selectedSize) {
            // Tìm tất cả biến thể có size này
            const variantsWithSize = product.variants.filter(v => v.size === selectedSize);
            
            // Lấy danh sách màu (unique)
            const colors = [...new Set(variantsWithSize.map(v => v.color))];
            setAvailableColors(colors);
            
            // Reset màu đang chọn (để khách chọn lại)
            setSelectedColor(null);
        } else {
            setAvailableColors([]);
        }
    }, [selectedSize, product]);

    // Khi chọn Màu -> Tự động đổi ảnh chính nếu biến thể đó có ảnh riêng
    useEffect(() => {
        if (selectedSize && selectedColor) {
            const variant = getSelectedVariant();
            if (variant && variant.imageUrl) {
                setMainImage(variant.imageUrl);
            }
        }
    }, [selectedColor]);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            const res = await productService.getById(id);
            const data = res.data; 
            
            setProduct(data);
            setMainImage(data.thumbnail);

            if (data.variants && data.variants.length > 0) {
                const uniqueSizes = [...new Set(data.variants.map(v => v.size))].sort((a, b) => a - b);
                setAvailableSizes(uniqueSizes);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            message.error("Không tìm thấy sản phẩm!");
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    // Hàm tìm biến thể chính xác dựa trên Size VÀ Màu
    const getSelectedVariant = () => {
        if (!product || !selectedSize || !selectedColor) return null;
        return product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            message.warning('Vui lòng chọn Size giày!');
            return;
        }
        if (!selectedColor) {
            message.warning('Vui lòng chọn Màu sắc!');
            return;
        }

        const currentVariant = getSelectedVariant();
        
        if (currentVariant && currentVariant.stock < quantity) {
            message.error(`Mẫu này chỉ còn lại ${currentVariant.stock} sản phẩm!`);
            return;
        }

        addToCart(product, quantity, currentVariant);
        
        message.success({
            content: `Đã thêm ${product.name} (Size ${selectedSize} - ${selectedColor}) vào giỏ hàng!`,
            style: { marginTop: '20vh' },
        });
    };

    if (loading) return <div className="spinner-center"><Spin size="large" /></div>;
    if (!product) return null;

    const galleryImages = [
        product.thumbnail,
        ...(product.variants?.map(v => v.imageUrl).filter(url => url) || [])
    ].slice(0, 5);

    return (
        <div className="product-detail-container container py-20">
            <Row gutter={[40, 40]}>
                <Col xs={24} md={12}>
                    <div className="product-image-wrapper">
                        <Image 
                            src={mainImage || "https://placehold.co/500x500?text=No+Image"} 
                            alt={product.name}
                            className="main-image"
                        />
                    </div>
                    
                    <div className="thumbnail-list mt-20 d-flex gap-sm">
                        {galleryImages.map((img, index) => (
                             <div 
                                key={index} 
                                className={`thumb-item cursor-pointer ${mainImage === img ? 'active' : ''}`}
                                onClick={() => setMainImage(img)}
                             >
                                <img src={img} alt="thumb" />
                             </div>
                        ))}
                    </div>
                </Col>

                <Col xs={24} md={12}>
                    <div className="product-info-wrapper">
                        <Tag color="blue" className="mb-10">{product.category?.name || "Sneaker"}</Tag>
                        <Title level={2} style={{ margin: '5px 0' }}>{product.name}</Title>
                        
                        <div className="d-flex align-center gap-md mb-20">
                            <Rate disabled defaultValue={5} style={{ fontSize: 14 }} />
                            <Text type="secondary">(Hàng chính hãng)</Text>
                        </div>

                        <Title level={3} className="text-danger price-tag">
                            {formatPrice(product.price)}
                        </Title>

                        <Paragraph className="product-desc">
                            {product.description || "Mô tả đang cập nhật..."} 
                        </Paragraph>

                        <Divider />

                        {/* --- CHỌN SIZE --- */}
                        <div className="mb-20">
                            <Text strong className="d-block mb-10">
                                Chọn Size: {selectedSize && <Tag color="green">Size {selectedSize}</Tag>}
                            </Text>
                            
                            {availableSizes.length > 0 ? (
                                <Radio.Group 
                                    value={selectedSize} 
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    buttonStyle="solid"
                                >
                                    {availableSizes.map(size => {
                                        // Kiểm tra tổng tồn kho của size này (bất kể màu nào)
                                        const variantsWithSize = product.variants.filter(v => v.size === size);
                                        const totalStockForSize = variantsWithSize.reduce((acc, curr) => acc + curr.stock, 0);
                                        const isOutOfStock = totalStockForSize <= 0;

                                        return (
                                            <Radio.Button 
                                                key={size} 
                                                value={size} 
                                                disabled={isOutOfStock} 
                                                className="size-btn"
                                            >
                                                {size}
                                            </Radio.Button>
                                        );
                                    })}
                                </Radio.Group>
                            ) : (
                                <Tag color="red">Tạm hết hàng</Tag>
                            )}
                        </div>

                        {/* --- CHỌN MÀU (Chỉ hiện khi đã chọn Size) --- */}
                        {selectedSize && (
                            <div className="mb-20">
                                <Text strong className="d-block mb-10">
                                    Chọn Màu: {selectedColor && <Tag color="orange">{selectedColor}</Tag>}
                                </Text>
                                <Radio.Group 
                                    value={selectedColor} 
                                    onChange={(e) => setSelectedColor(e.target.value)}
                                >
                                    {availableColors.map(color => {
                                        // Kiểm tra tồn kho cụ thể của Size + Màu này
                                        const variant = product.variants.find(v => v.size === selectedSize && v.color === color);
                                        const isStock = variant ? variant.stock > 0 : false;

                                        return (
                                            <Radio.Button 
                                                key={color} 
                                                value={color}
                                                disabled={!isStock}
                                                style={{ marginRight: 8, borderRadius: 4 }}
                                            >
                                                {color}
                                            </Radio.Button>
                                        );
                                    })}
                                </Radio.Group>
                            </div>
                        )}

                        {/* --- SỐ LƯỢNG & STOCK --- */}
                        <div className="mb-20">
                            <Text strong className="d-block mb-10">Số lượng:</Text>
                            <InputNumber 
                                min={1} 
                                max={getSelectedVariant()?.stock || 1} 
                                value={quantity} 
                                onChange={setQuantity} 
                                size="large"
                                disabled={!selectedSize || !selectedColor} // Khóa lại nếu chưa chọn đủ
                            />
                            {selectedSize && selectedColor && getSelectedVariant() && (
                                <Text type="secondary" className="ml-10">
                                    (Còn {getSelectedVariant().stock} sản phẩm)
                                </Text>
                            )}
                        </div>

                        <div className="d-flex gap-md mt-40 action-buttons">
                            <Button 
                                size="large" 
                                icon={<ShoppingCartOutlined />} 
                                className="flex-1 btn-add-cart"
                                onClick={handleAddToCart}
                                disabled={!selectedSize || !selectedColor}
                            >
                                THÊM VÀO GIỎ
                            </Button>
                            
                            <Button 
                                type="primary"
                                size="large" 
                                icon={<ThunderboltOutlined />} 
                                className="flex-1 btn-buy-now"
                                disabled={!selectedSize || !selectedColor}
                            >
                                MUA NGAY
                            </Button>
                        </div>

                        <div className="policy-box mt-40">
                            <div className="d-flex gap-sm align-center mb-10">
                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                <Text>Hàng chính hãng 100%</Text>
                            </div>
                            <div className="d-flex gap-sm align-center">
                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                <Text>Đổi trả miễn phí trong 7 ngày</Text>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetailPage;