import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  sendOtp: (email) => api.post('/auth/send-otp', { email }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
}

// Bill Splitter API
export const billSplitterAPI = {
  calculate: (data) => api.post('/bill-splitter/calculate', data),
  getHistory: () => api.get('/bill-splitter/history'),
  save: (data) => api.post('/bill-splitter/save', data),
}

// Grocery List API
export const groceryListAPI = {
  testConnection: () => api.get('/grocery-list/test'),
  getList: (date) => api.get(`/grocery-list/${date}`),
  addItem: (date, data) => api.post(`/grocery-list/${date}/items`, data),
  updateItem: (date, itemId, data) => api.put(`/grocery-list/${date}/items/${itemId}`, data),
  deleteItem: (date, itemId) => api.delete(`/grocery-list/${date}/items/${itemId}`),
  saveList: (date, items) => api.post(`/grocery-list/${date}/save`, { items }),
  getMonthlySummary: (year, month) => api.get(`/grocery-list/summary/${year}/${month}`),
  duplicateLastWeek: (date) => api.post(`/grocery-list/${date}/duplicate-last-week`),
}

// Health check
export const healthCheck = () => api.get('/health')

export default api
