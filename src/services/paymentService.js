import axiosClient from './axiosClient';

const paymentService = {
    createVietQR: (orderData) => {
        return axiosClient.post('/Payments/vietqr', orderData);
    }
};

export default paymentService;