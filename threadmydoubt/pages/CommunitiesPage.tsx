import React, { useState, useEffect, useMemo } from 'react';
import CommunityCard from '../components/CommunityCard';
import Modal from '../components/Modal';
import { generateCommunityDescription } from '../services/groqService';
import type { User } from '../types';
import { fireCelebration } from '../utils/celebrate';
import AuthPromptModal from '../components/AuthPromptModal';
import { communityService } from '../services/communityService';

const FILTERS = ['All', 'Technology', 'Science', 'Design', 'Programming', 'Art'];

interface CommunitiesPageProps {
    user: User | null;
    setNotification: (message: string) => void;
}

const CommunitiesPage: React.FC<CommunitiesPageProps> = ({ user, setNotification }) => {
    const [communities, setCommunities] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [newCommunityName, setNewCommunityName] = useState('');
    const [newCommunityDesc, setNewCommunityDesc] = useState('');
    const [newCommunityCategory, setNewCommunityCategory] = useState('');
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const res = await communityService.getCommunities();
                if (res.success) {
                    setCommunities(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch communities", err);
            }
        };
        fetchCommunities();
    }, []);

    const filteredCommunities = useMemo(() => {
        if (activeFilter === 'All') {
            return [...communities].sort((a, b) => (b.members?.length || 0) - (a.members?.length || 0));
        }
        return communities.filter(community => community.category === activeFilter);
    }, [activeFilter, communities]);

    const handleGenerateDesc = async () => {
        if (!newCommunityName) {
            alert("Please enter a community name first.");
            return;
        }
        setIsGeneratingDesc(true);
        try {
            const desc = await generateCommunityDescription(newCommunityName);
            setNewCommunityDesc(desc);
        } catch (err) {
            console.error(err);
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    const handleCreateCommunity = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await communityService.createCommunity({
                name: newCommunityName,
                description: newCommunityDesc,
                category: newCommunityCategory
            });
            if (res.success) {
                setCommunities([...communities, res.data]);
                fireCelebration();
                setNotification(`🎉 Community "${newCommunityName}" created!`);
                setIsModalOpen(false);
                setNewCommunityName('');
                setNewCommunityDesc('');
                setNewCommunityCategory('');
            }
        } catch (err: any) {
            alert(err.message || 'Error creating community');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        if (user) {
            setIsModalOpen(true);
        } else {
            setIsAuthModalOpen(true);
        }
    };

    return (
        <>
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="relative max-w-2xl mx-auto">
                        <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]"></i>
                        <input
                            type="text"
                            placeholder="Search communities, threads, or topics..."
                            className="w-full pl-12 pr-4 py-3.5 input-field"
                        />
                    </div>
                    <div className="flex justify-center flex-wrap gap-2 mt-6">
                        {FILTERS.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeFilter === filter
                                        ? 'bg-[color:var(--accent)] text-white'
                                        : 'bg-[color:var(--bg-secondary)] text-[color:var(--text-normal)] hover:bg-[color:var(--bg-elevated)]'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-6 text-[color:var(--text-strong)]">
                        {activeFilter === 'All' ? 'Popular Communities' : `${activeFilter} Communities`}
                    </h2>
                    {filteredCommunities.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCommunities.map((community, index) => (
                                <CommunityCard key={community.slug} community={community} delay={index * 100} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-[color:var(--bg-secondary)] rounded-[var(--radius-lg)] border border-dashed border-[color:var(--border-strong)]">
                            <i className="fas fa-search-minus text-4xl text-[color:var(--text-muted)] mb-4"></i>
                            <h3 className="text-xl font-semibold text-[color:var(--text-strong)]">No Communities Found</h3>
                            {activeFilter === 'All' ? (
                                <p className="text-[color:var(--text-muted)]">Be the first to create one!</p>
                            ) : (
                                <p className="text-[color:var(--text-muted)]">No communities match the "{activeFilter}" category yet.</p>
                            )}
                        </div>
                    )}
                </section>
            </div>

            <button onClick={handleOpenCreateModal} className="fixed bottom-8 right-8 w-16 h-16 bg-[color:var(--accent)] text-white rounded-full flex items-center justify-center text-2xl shadow-[var(--shadow-glow)] hover:bg-[color:var(--accent-soft)] transition-all duration-300 transform hover:scale-110 hover:rotate-90" aria-label="Create new community">
                <i className="fas fa-plus"></i>
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Community">
                <form onSubmit={handleCreateCommunity} className="space-y-4">
                    <div>
                        <label htmlFor="communityName" className="block text-sm font-medium text-[color:var(--text-muted)] mb-1">Community Name</label>
                        <input
                            type="text"
                            id="communityName"
                            value={newCommunityName}
                            onChange={(e) => setNewCommunityName(e.target.value)}
                            className="w-full p-2.5 input-field"
                            placeholder="e.g., Python Enthusiasts"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="communityDescription" className="block text-sm font-medium text-[color:var(--text-muted)]">Description</label>
                            <button type="button" onClick={handleGenerateDesc} disabled={isGeneratingDesc} className="text-xs font-semibold text-[color:var(--accent)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                                {isGeneratingDesc ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-robot"></i>}
                                {isGeneratingDesc ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                        <textarea
                            id="communityDescription"
                            rows={4}
                            value={newCommunityDesc}
                            onChange={(e) => setNewCommunityDesc(e.target.value)}
                            className="w-full p-2.5 input-field"
                            placeholder="What is this community about?"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="communityCategory" className="block text-sm font-medium text-[color:var(--text-muted)] mb-1">Category</label>
                        <select
                            id="communityCategory"
                            value={newCommunityCategory}
                            onChange={(e) => setNewCommunityCategory(e.target.value)}
                            className="w-full p-2.5 input-field"
                            required
                        >
                            <option value="" disabled>Select a category...</option>
                            {FILTERS.filter(f => f !== 'All').map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-[color:var(--accent)] text-white font-bold py-3 rounded-[var(--radius)] hover:bg-[color:var(--accent-soft)] transition-colors !mt-6">
                        Create Community
                    </button>
                </form>
            </Modal>

            <AuthPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};

export default CommunitiesPage;