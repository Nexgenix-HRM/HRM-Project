import axiosInstance from './axiosInstance';

export const todoApi = {
    getTodos: () => axiosInstance.get('/todos'),
    submitTodo: (data) => axiosInstance.post('/todos', data),
    updateTodo: (id, data) => axiosInstance.put(`/todos/${id}`, data),
};
