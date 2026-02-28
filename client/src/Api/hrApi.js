import axiosInstance from './axiosInstance';

export const hrApi = {
    getUsers: () => axiosInstance.get('/hr/users'),
    createUser: (userData) => axiosInstance.post('/hr/users', userData),
    deleteUser: (id) => axiosInstance.delete(`/hr/users/${id}`),
};
