import { apiPost } from './api';

export const voteService = {
    castVote: async (targetId: string, targetModel: 'Question' | 'Answer', type: 'upvote' | 'downvote') => {
        return await apiPost('/votes', { targetId, targetModel, type });
    }
};
