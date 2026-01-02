import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

console.log(api, 'api-created');
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
console.log(config, 'interceptor-config');
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
