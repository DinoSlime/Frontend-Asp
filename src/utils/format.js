// src/utils/format.js

export const formatPrice = (price) => {
    // Kiểm tra nếu giá trị null/undefined thì trả về 0đ
    if (!price && price !== 0) return '0 ₫';
    
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(price);
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

// 👇 Hàm mới thêm vào
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Kiểm tra nếu date không hợp lệ
    if (isNaN(date.getTime())) return 'Invalid Date';

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false 
    }).format(date);
};