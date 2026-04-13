import api from './api';

export const categoryService = {

    async getAll() 
    {
        const response = await api.get('/categories');
        return response;
    },

    async getById(id) 
    {
        const response = await api.get(`/categories/${id}`);
        return response;
    },

    async create(data) 
    {
        const response = await api.post('/categories', data);
        return response;
    },

    async update(id, data) 
    {
        const response = await api.put(`/categories/${id}`, data);
        return response;
    },

    async delete(id) 
    {
        const response = await api.delete(`/categories/${id}`);
        return response;
    }
};