import React from 'react';
import { Card, Typography, Tag, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import './ProductCard.css'; 
const { Meta } = Card;
const { Text } = Typography;

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(`/product/${product.id}`); 
    };

    return (
        <Card
            hoverable
            className="product-card"
            style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}
            cover={
                <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                    <img 
                        alt={product.name} 
                        src={product.thumbnail || "https://placehold.co/300x300?text=Sneaker"} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    />
                   
                    {product.variants?.every(v => v.stock <= 0) && (
                        <Tag color="red" style={{ position: 'absolute', top: 10, right: 0 }}>
                            HẾT HÀNG
                        </Tag>
                    )}
                </div>
            }
            onClick={handleCardClick} 
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                    {product.category?.name || "Giày Sneaker"}
                </Text>
                
                <Text strong style={{ fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.name}
                </Text>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <Text type="danger" strong style={{ fontSize: '16px' }}>
                        {formatPrice(product.price)}
                    </Text>
                    <Rate disabled defaultValue={5} style={{ fontSize: '10px' }} />
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;