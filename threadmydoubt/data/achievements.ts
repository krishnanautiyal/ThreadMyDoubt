import type { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  { 
    id: "achievement_firstQuestion", 
    name: "First Question Asked", 
    icon: "🎉",
    description: "Your curiosity shapes the world."
  },
  { 
    id: "achievement_firstAnswer", 
    name: "First Answer Posted", 
    icon: "✍️",
    description: "Contributing knowledge to the community."
  },
  { 
    id: "achievement_communityBuilder", 
    name: "Community Builder", 
    icon: "🏆",
    description: "You created your first community! A spark that ignites people."
  },
  {
    id: "achievement_popularAnswer",
    name: "Popular Answer",
    icon: "🔥",
    description: "One of your answers received 10 or more upvotes!"
  }
];
