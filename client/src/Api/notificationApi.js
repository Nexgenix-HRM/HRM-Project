import axiosInstance from './axiosInstance';

export const notificationApi = {
    getNotifications: () => axiosInstance.get('/notifications'),
    markAllAsRead: () => axiosInstance.post('/notifications/mark-all-as-read'),
    markOneAsRead: (id) => axiosInstance.post(`/notifications/${id}/mark-as-read`),
};
