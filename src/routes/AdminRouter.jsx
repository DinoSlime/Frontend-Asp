import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Admin/Dashboard';
import ProductManager from '../pages/Admin/ProductManager';
import CategoryManager from '../pages/Admin/CategoryManager';
import OrderManagement from '../pages/Admin/OrderManagement';
import UserManagement from '../pages/Admin/UserManagement';

const AdminRouter = () => {
    return (
        <Routes>
            {/* Vì ở AppRouter bạn đã khai báo path="/admin/*"
               Nên ở đây các Route con sẽ được tính từ /admin trở đi 
            */}
            <Route element={<AdminLayout />}>
                {/* Đường dẫn: /admin */}
                <Route index element={<Dashboard />} />
                
                {/* Đường dẫn: /admin/products */}
                <Route path="products" element={<ProductManager />} />
                
                {/* Đường dẫn: /admin/categories */}
                <Route path="categories" element={<CategoryManager />} />
                
                {/* Đường dẫn: /admin/orders */}
                <Route path="orders" element={<OrderManagement />} />
                
                {/* Đường dẫn: /admin/users */}
                <Route path="users" element={<UserManagement />} />
            </Route>
        </Routes>
    );
};

export default AdminRouter;