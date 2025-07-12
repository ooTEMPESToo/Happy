import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update to your backend URL if hosted
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default API;
