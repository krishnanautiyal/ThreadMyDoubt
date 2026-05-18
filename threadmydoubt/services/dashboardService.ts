import { apiGet } from './api';

export const dashboardService = {
    getStats: async () => {
        return await apiGet('/dashboard');
    }
};