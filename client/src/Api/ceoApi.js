import axiosInstance from './axiosInstance';

export const ceoApi = {
    getUsers: () => axiosInstance.get('/ceo/users'),
    createUser: (userData) => axiosInstance.post('/ceo/users', userData),
    deleteUser: (id) => axiosInstance.delete(`/ceo/users/${id}`),
};
