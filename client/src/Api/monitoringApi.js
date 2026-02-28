import axiosInstance from "./axiosInstance";

export const monitoringApi = {
    getOverview: (params) => axiosInstance.get('/monitoring/overview', { params }),
    getActivities: (date) => axiosInstance.get('/monitoring/activities', { params: { date } }),
    getTodos: (date) => axiosInstance.get('/monitoring/todos', { params: { date } }),
    getAttendance: (date) => axiosInstance.get('/monitoring/attendance', { params: { date } }),
};
