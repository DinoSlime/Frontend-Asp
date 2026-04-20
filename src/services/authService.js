import axiosClient from './axiosClient';

const authService = {
    login: (username, password) => {
        // Khớp với POST /api/Users/login trên Swagger
        return axiosClient.post('/Users/login', { username, password });
    },
    
    register: (data) => {
        // Khớp với POST /api/Users/register trên Swagger
        return axiosClient.post('/Users/register', data);
    },
    
    // Thay thế getMe() bằng API thực tế bạn đang có
    getAllUsers: () => {
        // Khớp với GET /api/Users/admin/all-users trên Swagger
        return axiosClient.get('/Users/admin/all-users');
    }
};

export default authService;