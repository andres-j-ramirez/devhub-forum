// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001', // your backend server URL
  withCredentials: true, // for cookie handling if applicable
});

export default api;
