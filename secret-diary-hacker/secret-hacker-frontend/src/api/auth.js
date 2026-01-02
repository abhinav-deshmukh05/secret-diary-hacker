import api from './axios';

export const login = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    }   catch (error) {
        throw error;
    }  
};

export const signup = async (data) => {
    try {
        const response = await api.post('/auth/signup', data);  
        return response.data;
    } catch (error) {
        throw error;
    }
};