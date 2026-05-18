import { apiGet, apiPost, apiPutbest, apiPut,apiDelete } from './api';
export const answerService = {

    getAnswers: async (params?: Record<string, string>) => {
        const query = params
            ? `?${new URLSearchParams(params).toString()}`
            : '';

        return await apiGet(`/answers${query}`);
    },

    getAnswersByQuestion: async (questionId: string) => {
        return await apiGet(`/answers/${questionId}`);
    },

    createAnswer: async (answerData: any) => {
        return await apiPost('/answers', answerData);
    },

    markBestAnswer: async (answerId: string) => {
        return await apiPutbest(`/answers/${answerId}/accept`);
    },

    deleteAnswer: async (answerId: string) => {
        return await apiDelete(`/answers/${answerId}`);
    }
};