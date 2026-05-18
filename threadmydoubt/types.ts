
export interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  posts: number;
  comments: number;
  icon: string;
  category: string;
}

export interface StoredCommunity {
  id: number;
  name: string;
  description: string;
  members: number;
  icon: string;
  category: string;
}

export interface StoredQuestion {
  id: number;
  title: string;
  body: string;
  communityId: number;
  createdAt: string;
  upvotes: number;
}

export interface StoredAnswer {
  id: number;
  questionId: number;
  username: string;
  body: string;
  createdAt: string;
  upvotes: number;
}

export interface Thread {
  id: number;
  title: string;
  community: string;
  postedAgo: string;
  upvotes: number;
  comments: number;
}

export interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  profilePicture?: string;
  role?: string;
  bio?: string;
  reputation?: number;
  questions?: number;
  answers?: number;
  upvotes?: number;
  achievements?: string[];
  token?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}