import { apiPost, apiGet, apiPut } from './api';

export const authService = {
    login: async (credentials: any) => {
        const response = await apiPost('/auth/login', credentials);
        if (response.user && response.token) {
            response.user.token = response.token; // save token with user
        }
        return response;
    },
    register: async (userData: any) => {
        const response = await apiPost('/auth/register', userData);
        if (response.user && response.token) {
            response.user.token = response.token;
        }
        return response;
    },
    getMe: async () => {
        return await apiGet('/auth/me');
    },
    updateProfile: async (profileData: any) => {
        const response = await apiPut('/auth/profile', profileData);
        if (response.user && response.token) {
            response.user.token = response.token;
        } else if (response.user) {
            // Keep existing token if not returned
            const stored = localStorage.getItem('threadMyDoubt-user');
            if (stored) {
                const parser = JSON.parse(stored);
                if (parser.token) response.user.token = parser.token;
            }
        }
        return response;
    }
};
