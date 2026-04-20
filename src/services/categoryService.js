import axiosClient from './axiosClient';

const categoryService = {
    getAll: () => {
        // Khớp với GET /api/Categories
        return axiosClient.get('/Categories');
    },
    create: (data) => {
        // Khớp với POST /api/Categories
        return axiosClient.post('/Categories', data);
    },
    update: (id, data) => {
        // Khớp với PUT /api/Categories/{id}
        return axiosClient.put(`/Categories/${id}`, data);
    },
    delete: (id) => {
        // Khớp với DELETE /api/Categories/{id}
        return axiosClient.delete(`/Categories/${id}`);
    }
};

export default categoryService;