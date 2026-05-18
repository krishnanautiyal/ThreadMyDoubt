import React, { useState } from 'react';
import type { Thread } from '../types';

interface ThreadCardProps {
    thread: Thread;
    delay: number;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, delay }) => {
    const [upvoted, setUpvoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(thread.upvotes);

    const handleUpvote = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (upvoted) {
            setUpvoteCount(upvoteCount - 1);
        } else {
            setUpvoteCount(upvoteCount + 1);
        }
        setUpvoted(!upvoted);
    };

    return (
        <article
            className="bg-[color:var(--bg-secondary)] rounded-[var(--radius-lg)] transition-all duration-300 flex cursor-pointer opacity-0 animate-fadeInUp border border-[color:var(--border-soft)] hover:border-[color:var(--border-strong)]"
            style={{ animationDelay: `${delay}ms` }}
            tabIndex={0}
        >
            <div className="flex-grow p-5">
                <h3 className="text-lg font-semibold text-[color:var(--text-strong)] hover:text-[color:var(--accent-soft)] transition-colors mb-2">
                    {thread.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[color:var(--text-muted)]">
                    <span>{thread.community}</span>
                    <span>•</span>
                    <span>{thread.postedAgo}</span>
                </div>
            </div>
            <div className="flex items-center justify-end space-x-5 p-5 border-l border-[color:var(--border-soft)]">
                 <button
                    onClick={handleUpvote}
                    className={`flex items-center gap-2 font-bold transition-colors text-sm ${upvoted ? 'text-[color:var(--accent-soft)]' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-normal)]'}`}
                    aria-label="Upvote thread"
                >
                    <i className="fas fa-caret-up text-lg"></i>
                    <span>{upvoteCount}</span>
                </button>
                <span className="flex items-center gap-2 text-[color:var(--text-muted)] text-sm" aria-label={`${thread.comments} comments`}>
                    <i className="far fa-comment-dots"></i> {thread.comments}
                </span>
            </div>
        </article>
    );
};

export default ThreadCard;