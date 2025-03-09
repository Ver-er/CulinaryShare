// API base URL configuration
// In development, this points to the local server
// In production, this should point to your deployed backend URL

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default API_BASE_URL; 