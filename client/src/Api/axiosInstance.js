import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for consistent error handling
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Generic error handling
        const message = error.response?.data?.message || 'Something went wrong';

        if (error.response?.status === 401) {
            // Handle unauthorized (session expired)
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/';
        }

        return Promise.reject({
            ...error,
            message: message
        });
    }
);

export default axiosInstance;
