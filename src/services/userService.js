import axiosClient from './axiosClient';

const userService = {
    // 1. Lấy danh sách tất cả người dùng (Chỉ Admin)
    getAll: () => {
        // Khớp với [HttpGet("admin/all-users")] ở Backend
        return axiosClient.get('/Users/admin/all-users');
    },

    // 2. Lấy chi tiết một người dùng theo ID
    getById: (id) => {
        return axiosClient.get(`/Users/${id}`);
    },

    // 3. Admin tạo mới người dùng
    // (Dùng chung endpoint register hoặc endpoint tạo riêng nếu có)
    create: (userData) => {
        return axiosClient.post('/Users/register', userData);
    },

    // 4. Admin cập nhật thông tin người dùng (Họ tên, SĐT, Địa chỉ, Role)
    // Khớp với [HttpPut("{id}")] bạn vừa bổ sung ở Backend
    update: (id, userData) => {
        return axiosClient.put(`/Users/${id}`, userData);
    },

    // 5. Admin xóa người dùng
    // Khớp với [HttpDelete("{id}")] ở Backend
    delete: (id) => {
        return axiosClient.delete(`/Users/${id}`);
    }
};

export default userService;