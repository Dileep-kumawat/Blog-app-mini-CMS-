import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_ENDPOINT,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            return Promise.reject({
                msg: error.response.data?.msg || 'Something went wrong',
                status: error.response.status,
                success: false,
            });
        }
        return Promise.reject({
            msg: 'Network error — check your connection',
            status: 0,
            success: false,
        });
    }
);

export default api;