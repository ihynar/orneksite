import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('piril_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCollection = async (path) => {
  const { data } = await api.get(path);
  return data;
};

export const createItem = async (path, payload) => {
  const { data } = await api.post(path, payload);
  return data;
};

export const updateItem = async (path, payload) => {
  const { data } = await api.put(path, payload);
  return data;
};

export const deleteItem = async (path) => {
  await api.delete(path);
};

export default api;
