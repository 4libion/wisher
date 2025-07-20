import api from "../auth/axiosConfig";

export const fetchWishlists = () => api.get('/wishlist/');
export const fetchWishlist = (id) => api.get(`/wishlist/${id}/`);
export const fetchWishlistBySlug = (slug) => api.get(`/wishlist/shared/${slug}/`);

export const createWishlist = (data) => api.post('/wishlist/', data);
export const updateWishlist = (id, data) => api.put(`/wishlist/${id}/`, data);
export const deleteWishlist = (id) => api.delete(`/wishlist/${id}/`);

export const fetchWishlistItems = (id) => api.get(`/wishlist/${id}/items/`);
export const fetchWishlistItem = (id) => api.get(`/wishlist/items/${id}/`);

export const createWishlistItem = (id, data) => api.post(`/wishlist/${id}/items/`, data);
export const updateWishlistItem = (id, data) => api.put(`/wishlist/items/${id}/`, data);
export const deleteWishlistItem = (id) => api.delete(`/wishlist/items/${id}/`);