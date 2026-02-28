import axiosInstance from './axiosInstance';

export const attendanceApi = {
    getLogs: () => axiosInstance.get('/attendance'),
    getStatus: () => axiosInstance.get('/attendance/status'),
    checkIn: () => axiosInstance.post('/attendance/check-in'),
    checkOut: () => axiosInstance.post('/attendance/check-out'),
};
