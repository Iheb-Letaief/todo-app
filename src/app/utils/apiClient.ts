import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to automatically add the auth token
apiClient.interceptors.request.use(
    async (config) => {
        const session = await getSession();

        if (session?.token) {
            config.headers.Authorization = `Bearer ${session.token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;