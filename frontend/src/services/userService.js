import api from './api';

export const userService = {
    async update(id, data) 
    {
        const response = await api.put(`/users/${id}`, data);
        return response;
    },


    async getProfile(id) 
    {
        const response = await api.get(`/users/${id}`);
        return response;
  }
}