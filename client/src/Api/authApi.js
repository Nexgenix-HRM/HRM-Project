import axiosInstance from './axiosInstance';

export const authApi = {
    login: (credentials) => axiosInstance.post('/login', credentials),
};
