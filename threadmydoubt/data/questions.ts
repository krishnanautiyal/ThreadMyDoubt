import type { StoredQuestion } from '../types';

export const DEMO_QUESTIONS: StoredQuestion[] = [
    // Questions for React Fanatics (communityId: 1)
    {
        id: 101,
        title: "What's the best way to manage global state in React in 2024?",
        body: "I've used Redux in the past, but I'm wondering if Zustand or Jotai are better for new projects. What are the pros and cons?",
        communityId: 1,
        createdAt: new Date('2024-05-10T09:00:00Z').toISOString(),
        upvotes: 28,
    },
    {
        id: 102,
        title: "How do React Server Components (RSC) change data fetching?",
        body: "I'm starting a new Next.js 14 project and trying to wrap my head around RSC. Can I still use TanStack Query or SWR on the client?",
        communityId: 1,
        createdAt: new Date('2024-05-12T14:30:00Z').toISOString(),
        upvotes: 15,
    },

    // Questions for AI Explorers (communityId: 2)
    {
        id: 201,
        title: "Fine-tuning a small LLM vs. using a larger one via API?",
        body: "For a specific NLP task, would it be more cost-effective and performant to fine-tune a model like Llama 3 8B, or just use the Gemini API? What factors should I consider?",
        communityId: 2,
        createdAt: new Date('2024-05-11T11:20:00Z').toISOString(),
        upvotes: 42,
    },
    {
        id: 202,
        title: "What are some practical applications of Retrieval-Augmented Generation (RAG)?",
        body: "I understand the concept of RAG, but I'm looking for real-world examples beyond a simple Q&A bot on a PDF. How are companies using it in production?",
        communityId: 2,
        createdAt: new Date('2024-05-13T08:00:00Z').toISOString(),
        upvotes: 33,
    },

    // Questions for UI/UX Wizards (communityId: 3)
    {
        id: 301,
        title: "Are we overusing glassmorphism in UI design?",
        body: "It seems like every other design on Dribbble has some sort of blurred background effect. Is this trend becoming cliché, and what are some fresh alternatives for creating depth?",
        communityId: 3,
        createdAt: new Date('2024-05-09T18:00:00Z').toISOString(),
        upvotes: 19,
    },
    
    // Questions for Node.js Ninjas (communityId: 4)
    {
        id: 401,
        title: "Which is better for a new Node.js project: ElysiaJS, Hono, or sticking with Express?",
        body: "I'm seeing a lot of hype around new, fast frameworks built on Bun or for edge environments. Is it worth leaving the massive ecosystem of Express behind for the performance gains?",
        communityId: 4,
        createdAt: new Date('2024-05-14T10:00:00Z').toISOString(),
        upvotes: 25,
    },
];
