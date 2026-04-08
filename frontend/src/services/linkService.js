import api from './api';

export const linkService = {
    
    async getAll() {
        const response = await api.get('/links');
        return response;
    },

    async getById(id)
    {
        const response = await api.get(`/links/${id}`);
        return response;
    },

    async create(data)
    {
        const response = await api.post('/links', data);
        return response;
    },

    async update(id , data)
    {
        const response = await api.put(`/links/${id}`, data);
        return response;
    },

    async delete(id)
    {
        const response = await api.delete(`/links/${id}`);
        return response;
    }
};