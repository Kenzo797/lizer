import { config } from "@vue/test-utils";
import axios from "axios";

const getBaseURL = () => 
{

    if(import.meta.env.PROD)
    {
        return '/api';
    }

    return 'http://localhost:3000/api';
}

const api = axios.create({
    baseURL : getBaseURL(),
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token)
        {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api;