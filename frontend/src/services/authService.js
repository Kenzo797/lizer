import api from "./api";

export const authService = {
    
    async login(credentials) 
    {
        const response = await api.post('/auth/login', credentials);
        return response;
    },

    async register(userData) 
    {
        const response = await api.post('auth/register', userData);
        return response;
    },

    logout() 
    {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};