import axiosClient from './axiosClient'; 

const orderService = {
    createOrder: (orderData) => {
        // Khớp với POST /api/Orders
        return axiosClient.post('/Orders', orderData);
    },
    getOrdersByUser: (userId) => {
        // Khớp với GET /api/Orders/user/{userId}
        return axiosClient.get(`/Orders/user/${userId}`);
    },
    getOrderById: (orderId) => {
        // Khớp với GET /api/Orders/{id}
        return axiosClient.get(`/Orders/${orderId}`);
    },
    getAllOrders: () => {
        // Khớp với GET /api/Orders/admin/get-all
        return axiosClient.get('/Orders/admin/get-all');
    },
    updateOrderStatus: (orderId, status) => {
        // Khớp với PUT /api/Orders/admin/update-status/{id}?status=...
        return axiosClient.put(`/Orders/admin/update-status/${orderId}`, null, {
            params: { status }
        });
    }
};

export default orderService;