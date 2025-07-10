import axios from 'axios';
import { getAccessToken, getRefreshToken, logoutUser } from './AuthService';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({ baseURL: backendUrl });

api.interceptors.request.use(config => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    res => res,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && getRefreshToken()) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(`${backendUrl}/auth/token/refresh/`, {
                    refresh: getRefreshToken()
                });
                const newAccessToken = res.data.access;
                localStorage.setItem('access_token', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                logoutUser();
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;