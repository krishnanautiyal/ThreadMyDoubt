import { apiGet, apiPost } from './api';

export const communityService = {
    getCommunities: async () => {
        return await apiGet('/communities');
    },
    getCommunity: async (id: string) => {
        return await apiGet(`/communities/${id}`);
    },
    createCommunity: async (communityData: any) => {
        return await apiPost('/communities', communityData);
    },
    joinCommunity: async (id: string) => {
        return await apiPost(`/communities/${id}/join`, {});
    }
};
