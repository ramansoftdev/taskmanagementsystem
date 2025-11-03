import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Board APIs
export const boardAPI = {
  getAll: () => api.get('/boards'),
  getById: (id) => api.get(`/boards/${id}`),
  create: (data) => api.post('/boards', data),
  update: (id, data) => api.put(`/boards/${id}`, data),
  delete: (id) => api.delete(`/boards/${id}`),
};

// Column APIs
export const columnAPI = {
  getByBoardId: (boardId) => api.get(`/columns/board/${boardId}`),
  create: (boardId, data) => api.post(`/columns/board/${boardId}`, data),
  update: (id, data) => api.put(`/columns/${id}`, data),
  delete: (id) => api.delete(`/columns/${id}`),
};

// Task APIs
export const taskAPI = {
  getByColumnId: (columnId) => api.get(`/tasks/column/${columnId}`),
  create: (columnId, data) => api.post(`/tasks/column/${columnId}`, data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default api;