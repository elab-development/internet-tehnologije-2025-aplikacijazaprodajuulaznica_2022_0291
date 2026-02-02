import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api'; 

const http = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, 
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    response => response, 
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
        }
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default http;