import axiosInstance from './axiosInstance';

export const leaveApi = {
    getLeaves: () => axiosInstance.get('/leaves'),
    getMyLeaves: () => axiosInstance.get('/leaves/my'),
    submitLeave: (formData) => axiosInstance.post('/leaves', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateStatus: (id, status) => axiosInstance.put(`/leaves/${id}/status`, { status }),
};
