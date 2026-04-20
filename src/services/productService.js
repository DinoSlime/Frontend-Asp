import axiosClient from './axiosClient';

const productService = {
    // Lấy danh sách (Có phân trang)
    getAll: (params) => {
        // Khớp với GET /api/Products
        return axiosClient.get('/Products', { params });
    },
    
    // Lấy chi tiết 1 sản phẩm (Để sửa/xem chi tiết)
    getById: (id) => {
        // Khớp với GET /api/Products/{id}
        return axiosClient.get(`/Products/${id}`);
    },

    // Thêm mới
    create: (data) => {
        // Khớp với POST /api/Products
        return axiosClient.post('/Products', data); 
    },

    // Cập nhật
    update: (id, data) => {
        // Khớp với PUT /api/Products/{id}
        return axiosClient.put(`/Products/${id}`, data);
    },

    // Xóa sản phẩm
    delete: (id) => {
        // Khớp với DELETE /api/Products/{id}
        return axiosClient.delete(`/Products/${id}`);
    },
    
    // Tìm kiếm sản phẩm (Bổ sung từ ảnh Swagger)
    search: (params) => {
        // Khớp với GET /api/Products/search
        return axiosClient.get('/Products/search', { params });
    }
};

export default productService;