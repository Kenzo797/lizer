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
    baseURL: import.meta.env.VITE_API_URL || getBaseURL(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;