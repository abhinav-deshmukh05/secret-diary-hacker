import api from './axios';

export const getNotes = async () => {
    try {
        const response = await api.get('/notes');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createNote = async (noteData) => {
    try {
        const response = await api.post('/notes', noteData);
        return response.data;
    } catch (error) {
        throw error;
    }
};