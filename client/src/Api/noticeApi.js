import axiosInstance from './axiosInstance';

export const noticeApi = {
    // Get all published notices (for all users)
    getNotices: (params) => axiosInstance.get('/notices', { params }),

    // Get all notices including unpublished (for HR/CEO)
    getAllNotices: () => axiosInstance.get('/notices/all'),

    // Create new notice
    createNotice: (data) => axiosInstance.post('/notices', data),

    // Update notice
    updateNotice: (id, data) => axiosInstance.put(`/notices/${id}`, data),

    // Toggle publish status
    togglePublish: (id) => axiosInstance.put(`/notices/${id}/toggle-publish`),

    // Delete notice
    deleteNotice: (id) => axiosInstance.delete(`/notices/${id}`),
};
