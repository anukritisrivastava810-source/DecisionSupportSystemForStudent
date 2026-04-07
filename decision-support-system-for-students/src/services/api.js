import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';

let apiUrl = isProduction
  ? (process.env.REACT_APP_API_URL || "https://decisionsupportsystemforstudent.onrender.com")
  : (process.env.REACT_APP_API_URL || "http://localhost:5001");

// Ensure the base URL correctly points to the /api namespace
if (!apiUrl.endsWith('/api')) {
  apiUrl = apiUrl.replace(/\/$/, '') + '/api';
}

export const BASE_URL = apiUrl;

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT (preferred) or legacy userId header ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  // Keep legacy userid header for backward-compatible routes
  if (userId) {
    config.headers['userid'] = userId;
  }

  return config;
});

// ─── Auth ────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (credential) => api.post('/auth/google', { credential }),
};

// ─── Health ──────────────────────────────────────────────
export const healthAPI = {
  check: (config) => api.get('/health', config)
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

export const domainInfoAPI = {
  getByDomain: (domain) => api.get(`/domain-info/${encodeURIComponent(domain)}`),
  getAll: () => api.get('/domain-info'),
};

export const careerGuideAPI = {
  getByGoal: (goal) => api.get('/career-guide', { params: { goal } }),
  getAll: () => api.get('/career-guide/all'),
};

export const adminAPI = {
  getOverview: () => api.get('/admin/overview'),
  getUsers: () => api.get('/admin/users'),
  getSearches: () => api.get('/admin/searches'),
  getActivity: () => api.get('/admin/activity'),
  getTraffic: () => api.get('/admin/traffic'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export const trafficAPI = {
  logVisit: (data) => api.post('/admin/traffic', data),
  logSearch: (data) => api.post('/admin/searches', data),
  logHeartbeat: (data) => api.post('/admin/traffic/heartbeat', data),
};

export const careerSearchAPI = {
  search: (query) => api.get(`/career-search/${encodeURIComponent(query)}`),
};


export default api;
