import api from "../auth/axiosConfig";

export const register = (data) => api.post('/auth/register/', data);