import { apiGet, apiPost, apiPut, apiDelete } from './api';

export const questionService = {
    getQuestions: async (params?: Record<string, string>) => {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return await apiGet(`/questions${query}`);
    },
    getQuestion: async (id: string) => {
        return await apiGet(`/questions/${id}`);
    },
    createQuestion: async (questionData: any) => {
        return await apiPost('/questions', questionData);
    },
    updateQuestion: async (id: string, questionData: any) => {
        return await apiPut(`/questions/${id}`, questionData);
    },
    deleteQuestion: async (id: string) => {
        return await apiDelete(`/questions/${id}`);
    }
};
