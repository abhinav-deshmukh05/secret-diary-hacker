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

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Remove token and notify app to handle logout (SPA-friendly)
            localStorage.removeItem('token');
            window.dispatchEvent(new CustomEvent('app:logout'));
        }
        return Promise.reject(error);
    }
);

// Helper to check token expiry
export function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        return Date.now() >= payload.exp * 1000;
    } catch (e) {
        return true;
    }
}

export default api;
