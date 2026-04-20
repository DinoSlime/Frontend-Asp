import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import ProductDetailPage from '../pages/ProductDetail/ProductDetailPage';
import CartPage from '../pages/CartPage/CartPage';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import OrderHistoryPage from '../pages/Order/OrderHistoryPage';
import OrderDetailPage from '../pages/Order/OrderDetailPage';
import ProductListPage from '../pages/ProductList/ProductListPage';
const UserRouter = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />

                <Route path="product/:id" element={<ProductDetailPage />} />
                
                <Route path="/checkout" element={<CheckoutPage />} />
               <Route path="/cart" element={<CartPage />} />
               <Route path="/orders" element={<OrderHistoryPage />} />
                <Route path="/order/:id" element={<OrderDetailPage />} />
                <Route path="/products" element={<ProductListPage />} />
            </Route>
        </Routes>
    );
};

export default UserRouter;