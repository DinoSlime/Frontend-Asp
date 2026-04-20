import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Admin/Dashboard';
import ProductManager from '../pages/Admin/ProductManager';
import CategoryManager from '../pages/Admin/CategoryManager';
import OrderManagement from '../pages/Admin/OrderManagement';

const AdminRouter = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                
                <Route path="products" element={<ProductManager />} />
                <Route path="categories" element={<CategoryManager />} />
               
                <Route path="orders" element={<OrderManagement />} />

               
                <Route path="users" element={<div>Quản lý người dùng</div>} />
            </Route>
        </Routes>
    );
};

export default AdminRouter;