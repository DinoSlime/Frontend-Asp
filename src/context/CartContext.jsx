import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

   
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

   
    const addToCart = (product, quantity, selectedVariant) => {
        setCartItems(prev => {
           
            const existingItem = prev.find(item => 
                item.id === product.id && item.variantId === selectedVariant.id
            );

            if (existingItem) {
               
                return prev.map(item => 
                    (item.id === product.id && item.variantId === selectedVariant.id)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                
                return [...prev, {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    thumbnail: product.thumbnail,
                    quantity: quantity,
                    variantId: selectedVariant.id, 
                    size: selectedVariant.size,
                    color: selectedVariant.color
                }];
            }
        });
    };

   
    const removeFromCart = (productId, variantId) => {
        setCartItems(prev => prev.filter(item => !(item.id === productId && item.variantId === variantId)));
    };

   
    const updateQuantity = (productId, variantId, newQuantity) => {
        setCartItems(prev => prev.map(item => 
            (item.id === productId && item.variantId === variantId)
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    
    const clearCart = () => {
        setCartItems([]);
    };

   
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart,
            totalItems 
        }}>
            {children}
        </CartContext.Provider>
    );
};