import axiosInstance from './axiosInstance';

export const employeeApi = {
    getProfile: () => axiosInstance.get('/profile'),
    updateProfile: (formData) => axiosInstance.post('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getActivities: (date) => axiosInstance.get('/activities', { params: { date } }),
    submitActivity: (data) => axiosInstance.post('/activities', data),
    getDirectory: () => axiosInstance.get('/directory'),
    getDashboardData: () => axiosInstance.get('/employee/dashboard'),
};
