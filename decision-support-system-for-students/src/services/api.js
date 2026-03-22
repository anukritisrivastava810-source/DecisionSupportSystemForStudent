import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach userId from localStorage to every request
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) config.headers['userid'] = userId;
  return config;
});

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// ─── Skills ─────────────────────────────────────────────
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  add: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

// ─── Goals ──────────────────────────────────────────────
export const goalsAPI = {
  getAll: () => api.get('/goals'),
  add: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
};

// ─── Opportunities ───────────────────────────────────────
export const opportunitiesAPI = {
  getAll: () => api.get('/opportunities'),
  save: (data) => api.post('/opportunities', data),
  update: (id, data) => api.put(`/opportunities/${id}`, data),
  delete: (id) => api.delete(`/opportunities/${id}`),
};

// ─── History ────────────────────────────────────────────
export const historyAPI = {
  get: () => api.get('/history'),
  addSearch: (searchQuery) => api.post('/history', { searchQuery }),
  addActivity: (activityLog) => api.post('/history', { activityLog }),
};

// ─── Dashboard ──────────────────────────────────────────
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

// ─── Profile ────────────────────────────────────────────
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

export default api;
