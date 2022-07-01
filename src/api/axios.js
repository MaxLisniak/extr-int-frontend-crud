import axios from 'axios';
const BASE_URL = "http://localhost:3001";

// axios object for standard requests
export default axios.create({
    baseURL: BASE_URL
});

// axios object for sending requests with cookies
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});