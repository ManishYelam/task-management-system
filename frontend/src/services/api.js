import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
})

// Add token to requests
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

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
}

// Tasks API
export const tasksAPI = {
  getAll: (params = {}) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, updates) => api.patch(`/tasks/${id}`, updates),
  delete: (id) => api.delete(`/tasks/${id}`),
  getStats: () => api.get('/tasks/dashboard/stats'),
}

// Users API
export const usersAPI = {
  getEmployees: () => api.get('/users/employees'),
  createEmployee: (employeeData) => api.post('/users/employees', employeeData),
  getEmployee: (id) => api.get(`/users/employees/${id}`),
}

export default api