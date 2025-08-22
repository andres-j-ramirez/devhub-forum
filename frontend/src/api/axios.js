// src/api/axios.js
import axios from 'axios';

// On GitHub Pages, use relative URLs so requests stay on the same origin.
// Else, use env or fall back to local dev backend.
const base =
  (typeof window !== 'undefined' && /\.github\.io$/.test(window.location.hostname))
    ? ''
    : (process.env.VUE_APP_API_BASE || 'http://localhost:5001');

const api = axios.create({
  baseURL: base,
  withCredentials: false,
});

export default api;
