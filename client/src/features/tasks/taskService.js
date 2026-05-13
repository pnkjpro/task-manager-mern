import axios from 'axios';

const API_URL = '/api/tasks';

// Helper to get auth header
const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Get tasks with filters
const getTasks = async (token, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;
  const response = await axios.get(url, getConfig(token));
  return response.data;
};

// Create task
const createTask = async (token, taskData) => {
  const response = await axios.post(API_URL, taskData, getConfig(token));
  return response.data.data;
};

// Update task
const updateTask = async (token, taskId, taskData) => {
  const response = await axios.put(`${API_URL}/${taskId}`, taskData, getConfig(token));
  return response.data.data;
};

// Delete task
const deleteTask = async (token, taskId) => {
  const response = await axios.delete(`${API_URL}/${taskId}`, getConfig(token));
  return response.data.data;
};

// Get task stats
const getTaskStats = async (token) => {
  const response = await axios.get(`${API_URL}/stats`, getConfig(token));
  return response.data.data;
};

const taskService = { getTasks, createTask, updateTask, deleteTask, getTaskStats };
export default taskService;
