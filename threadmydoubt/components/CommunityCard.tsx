import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CommunityCardProps {
    community: any;
    delay: number;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, delay }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/community/${community.slug}`);
    };

    return (
        <article
            className="bg-[color:var(--bg-secondary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] flex flex-col overflow-hidden opacity-0 animate-fadeInUp border border-[color:var(--border-soft)] transition-all duration-300 transform hover:scale-[1.02] hover:border-[color:var(--accent)] hover:shadow-[var(--shadow-glow-soft)] cursor-pointer"
            style={{ animationDelay: `${delay}ms` }}
            onClick={handleNavigate}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
        >
            <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[color:var(--bg-elevated)] rounded-[var(--radius)] flex items-center justify-center text-2xl text-[color:var(--accent-soft)]">
                        <i className={`fas ${community.icon}`}></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[color:var(--text-strong)]">{community.name}</h3>
                        {/* <p className="text-sm text-[color:var(--text-muted)]">{community.members.length || 0} members</p> */}
                    </div>
                </div>

                <p className="text-[color:var(--text-normal)] text-sm mb-6 flex-grow">{community.description}</p>

                <div
                    className={`w-full font-bold py-2.5 px-4 rounded-[var(--radius)] transition-all duration-300 flex items-center justify-center gap-2 text-sm bg-[color:var(--accent)] text-white`}
                >
                    <i className={`fas fa-arrow-right`}></i>
                    <span>Explore</span>
                </div>
            </div>
        </article>
    );
};

export default CommunityCard;
