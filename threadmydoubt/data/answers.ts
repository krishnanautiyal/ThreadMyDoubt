import type { StoredAnswer } from '../types';

export const DEMO_ANSWERS: StoredAnswer[] = [
    // Answers for question 101 (React State Management)
    {
        id: 10101,
        questionId: 101,
        username: 'react_guru',
        body: 'Zustand is great for simplicity and minimal boilerplate. If you don\'t need the extensive middleware ecosystem of Redux, it\'s a fantastic choice for new projects. It feels more "React-y".',
        createdAt: new Date('2024-05-10T10:00:00Z').toISOString(),
        upvotes: 12,
    },
    {
        id: 10102,
        questionId: 101,
        username: 'old_school_dev',
        body: 'Don\'t discount Redux Toolkit. It has solved many of the boilerplate issues and its dev tools are still best-in-class for debugging complex state interactions.',
        createdAt: new Date('2024-05-10T11:30:00Z').toISOString(),
        upvotes: 7,
    },
    // Answers for question 201 (Fine-tuning LLM)
    {
        id: 20101,
        questionId: 201,
        username: 'ai_tinkerer',
        body: 'Fine-tuning gives you more control and potentially lower latency, but the upfront cost and effort are higher. If the Gemini API already performs well for your use case, start there. You can always fine-tune later if you hit a wall.',
        createdAt: new Date('2024-05-11T12:00:00Z').toISOString(),
        upvotes: 25,
    },
     // Answers for question 401 (Node.js frameworks)
    {
        id: 40101,
        questionId: 401,
        username: 'speed_demon',
        body: 'ElysiaJS is incredibly fast, especially on Bun. If raw performance is your number one priority for a new API, it\'s hard to beat. The developer experience is also top-notch with great TypeScript support.',
        createdAt: new Date('2024-05-14T11:00:00Z').toISOString(),
        upvotes: 18,
    },
    {
        id: 40102,
        questionId: 401,
        username: 'express_forever',
        body: 'The stability and massive middleware library for Express is still unmatched. For complex, enterprise-level applications, the maturity of the ecosystem can save you more development time than the performance gains from a newer framework.',
        createdAt: new Date('2024-05-14T12:30:00Z').toISOString(),
        upvotes: 9,
    },
];
