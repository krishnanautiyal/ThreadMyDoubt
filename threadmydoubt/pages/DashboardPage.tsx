

import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import Modal from '../components/Modal';
import LogsPanel from '../components/LogsPanel';
import { ACHIEVEMENTS } from '../data/achievements';
import { fireCelebration } from '../utils/celebrate';

interface DashboardPageProps {
    user: User;
    setUser: (user: User | null) => void;
    setNotification: (message: string) => void;
    preselectedCommunityId: number | null;
    clearPreselectedCommunityId: () => void;
}

const StatCard: React.FC<{ icon: string, value: string | number, label: string }> = ({ icon, value, label }) => (
    <div className="bg-[color:var(--bg-secondary)] p-6 rounded-[var(--radius-lg)] border border-[color:var(--border-soft)]">
        <div className="flex items-center gap-4">
            <i className={`fas ${icon} text-2xl text-[color:var(--accent-soft)] w-8 text-center`}></i>
            <div>
                <p className="text-2xl font-semibold text-[color:var(--text-strong)]">{value}</p>
                <p className="text-sm text-[color:var(--text-muted)]">{label}</p>
            </div>
        </div>
    </div>
);

import { questionService } from '../services/questionService';
import { communityService } from '../services/communityService';
import { authService } from '../services/authService';

const AskQuestionModalContent: React.FC<{
    onClose: () => void;
    setNotification: (message: string) => void;
    preselectedCommunityId: number | null;
}> = ({ onClose, setNotification, preselectedCommunityId }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [communityId, setCommunityId] = useState<string>(preselectedCommunityId ? String(preselectedCommunityId) : '');
    const [error, setError] = useState('');
    const [communities, setCommunities] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const res = await communityService.getCommunities();
                if (res.success) setCommunities(res.data);
            } catch (err) {
                console.error("Failed to fetch communities", err);
            }
        };
        fetchCommunities();
    }, []);

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await postToCommunity();
    };

    const resetAndClose = () => {
        setTitle('');
        setBody('');
        setCommunityId('');
        setError('');
        onClose();
    };

    const postToCommunity = async () => {
        setError('');
        if (!communityId) {
            setError('Please select a community for your question.');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();

formData.append('title', title);
formData.append('body', body);
formData.append('communityId', communityId);

if (image) {
    formData.append('image', image);
}

const res = await questionService.createQuestion(formData);
            if (res.success) {
                if (!localStorage.getItem("achievement_firstQuestion")) {
                    fireCelebration();
                    localStorage.setItem("achievement_firstQuestion", "true");
                }
                setNotification(`🎉 Your question has been posted!`);
                resetAndClose();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to post question');
        } finally {
            setIsLoading(false);
        }
    };



    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[250px] text-center">
                <div className="w-12 h-12 border-4 border-[color:var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-semibold text-[color:var(--text-strong)]">Posting Question...</h3>
                <p className="text-[color:var(--text-muted)]">Wait while we publish your question to the community.</p>
            </div>
        );
    }



    return (
        <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <div>
                <label htmlFor="questionTitle" className="block text-sm font-medium text-[color:var(--text-muted)] mb-1">Title</label>
                <input type="text" id="questionTitle" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., How to center a div?" className="w-full p-2.5 input-field" required />
            </div>
            <div>
                <label htmlFor="community" className="block text-sm font-medium text-[color:var(--text-muted)] mb-1">Community</label>
                <select id="community" value={communityId} onChange={e => setCommunityId(e.target.value)} className="w-full p-2.5 input-field" required>
                    <option value="" disabled>Select a community...</option>
                    {communities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="questionBody" className="block text-sm font-medium text-[color:var(--text-muted)] mb-1">Body</label>
                <textarea id="questionBody" rows={5} value={body} onChange={e => setBody(e.target.value)} placeholder="Include all the information someone would need to answer your question." className="w-full p-2.5 input-field" required></textarea>
            </div>
            <div>
    <label
        htmlFor="questionImage"
        className="block text-sm font-medium text-[color:var(--text-muted)] mb-1"
    >
        Upload Image (Optional)
    </label>

    <input
        type="file"
        id="questionImage"
        accept="image/*"
        onChange={(e) => {
    if (e.target.files && e.target.files[0]) {

        const file = e.target.files[0];

        setImage(file);

        setPreview(URL.createObjectURL(file));
    }
}}
        className="w-full p-2.5 input-field"
    />
</div>
            {error && <p className="text-sm text-[color:var(--danger)]">{error}</p>}
            <button type="submit" className="w-full bg-[color:var(--accent)] text-white font-bold py-3 rounded-[var(--radius)] hover:bg-[color:var(--accent-soft)] transition-colors !mt-6">
                Post Question
            </button>
        </form>
    );
};

const AchievementsPanel: React.FC<{ achievements?: string[] }> = ({ achievements = [] }) => {
    return (
        <section className="achievements-card">
            <h3>Achievements</h3>
            <div>
                {ACHIEVEMENTS.map(ach => {
                    const unlocked = achievements.includes(ach.id);
                    return (
                        <div key={ach.id} className={`achievement-item ${unlocked ? "active" : ""}`} title={ach.description}>
                            <span className="icon">{ach.icon}</span>
                            <div className="flex-grow">
                                <p className="name">{ach.name}</p>
                                <p className="description">{ach.description}</p>
                            </div>
                            {unlocked && <span className="dot"></span>}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};


import { answerService } from '../services/answerService';
import { dashboardService } from '../services/dashboardService';

const DashboardPage: React.FC<DashboardPageProps> = ({ user, setUser, setNotification, preselectedCommunityId, clearPreselectedCommunityId }) => {
    const [activeTab, setActiveTab] = useState('questions');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        username: user.username,
        role: user.role || 'Community Member',
        bio: user.bio || ''
    });

    const [myQuestions, setMyQuestions] = useState<any[]>([]);
    const [myAnswers, setMyAnswers] = useState<any[]>([]);
    const [dashboardStats, setDashboardStats] = useState<{ questions: number; answers: number; upvotes: number; reputation: number } | null>(null);

    // Extract authorId safely with nullish coalescing
    const authorId = user._id ?? user.id;

    // Derive stats from existing state - reactive to myQuestions and myAnswers changes
    const stats = React.useMemo(() => {
        const questionCount = myQuestions.length;
        const answerCount = myAnswers.length;
        const upvoteCount = myAnswers.reduce((total, answer) => total + (answer.upvotes || 0), 0);
        const reputation = (answerCount * 10) + (upvoteCount * 2);
        return { questions: questionCount, answers: answerCount, upvotes: upvoteCount, reputation };
    }, [myQuestions, myAnswers]);

    // Use derived stats, fallback to API if available
    const displayStats =stats;

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const res = await dashboardService.getStats();
                if (res.success) {
                    setDashboardStats(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                // Stats will fall back to derived state
            }
        };
        fetchDashboardStats();
    }, []);

    useEffect(() => {
        if (preselectedCommunityId) {
            setIsAskModalOpen(true);
        }
    }, [preselectedCommunityId]);
    
   useEffect(() => {
    if (!authorId) return;

    const fetchAllData = async () => {
        try {
            const [qRes, aRes] = await Promise.all([
                questionService.getQuestions({ authorId }),
                answerService.getAnswers({ authorId })
            ]);

            if (qRes.success) setMyQuestions(qRes.data);
            if (aRes.success) setMyAnswers(aRes.data);

        } catch (err) {
            console.error("Failed to fetch user data", err);
        }
    };

    fetchAllData();
}, [authorId]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await authService.updateProfile(profileData);
            if (response.success && response.user) {
                setUser(response.user);
                setNotification('Profile updated successfully!');
            }
        } catch (err: any) {
            setNotification('Error updating profile: ' + err.message);
        }
        setIsEditModalOpen(false);
    };

    const handleCloseAskModal = async () => {
        setIsAskModalOpen(false);
        if (preselectedCommunityId) {
            clearPreselectedCommunityId();
        }

        // Refresh profile to get potential new achievements
        try {
            const res = await authService.getMe();
            if (res.success) {
                const refreshedUser = { ...user, ...res.user };
                // Compare achievements for toast
                if (res.user.achievements && res.user.achievements.length > (user.achievements?.length || 0)) {
                    const newAchId = res.user.achievements[res.user.achievements.length - 1];
                    const ach = ACHIEVEMENTS.find(a => a.id === newAchId);
                    if (ach) {
                        setNotification(`🏆 Achievement Unlocked: ${ach.name}`);
                        fireCelebration();
                    }
                }
                setUser(refreshedUser);
            }
        } catch (e) {
            console.error("Failed to refresh user profile", e);
        }

        if (activeTab === 'questions' && authorId) {
            questionService.getQuestions({ authorId }).then(res => {
                if (res.success) setMyQuestions(res.data);
            });
        }

        // Refresh dashboard stats
        try {
            const res = await dashboardService.getStats();
            if (res.success) {
                setDashboardStats(res.data);
            }
        } catch (err) {
            console.error("Failed to refresh dashboard stats", err);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <h1 className="text-4xl font-semibold text-[color:var(--text-strong)]">Dashboard</h1>
                <button onClick={() => setIsAskModalOpen(true)} className="bg-[color:var(--accent)] text-white font-bold py-2.5 px-6 rounded-[var(--radius)] hover:bg-[color:var(--accent-soft)] transition-all duration-300 transform hover:scale-105 shadow-[0_4px_15px_rgba(117,91,255,0.2)] flex items-center gap-2">
                    <i className="fas fa-plus-circle"></i> Ask Question
                </button>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard icon="fa-star" value={displayStats.reputation} label="Reputation" />
                        <StatCard icon="fa-question-circle" value={displayStats.questions} label="Questions" />
                        <StatCard icon="fa-lightbulb" value={displayStats.answers} label="Answers" />
                        <StatCard icon="fa-arrow-up" value={displayStats.upvotes} label="Upvotes" />
                    </section>

                    <section className="bg-[color:var(--bg-secondary)] rounded-[var(--radius-lg)] border border-[color:var(--border-soft)]">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-[color:var(--text-strong)]">My Activity</h3>
                            <div className="flex space-x-4 mt-4 border-b border-[color:var(--border-strong)]">
                                <button onClick={() => setActiveTab('questions')} className={`py-2 px-1 font-semibold border-b-2 ${activeTab === 'questions' ? 'border-[color:var(--accent)] text-[color:var(--accent-soft)]' : 'border-transparent text-[color:var(--text-muted)] hover:text-[color:var(--text-normal)]'}`}>My Questions</button>
                                <button onClick={() => setActiveTab('answers')} className={`py-2 px-1 font-semibold border-b-2 ${activeTab === 'answers' ? 'border-[color:var(--accent)] text-[color:var(--accent-soft)]' : 'border-transparent text-[color:var(--text-muted)] hover:text-[color:var(--text-normal)]'}`}>My Answers</button>
                            </div>
                        </div>
                        <div className="p-6 min-h-[150px]">
                            {activeTab === 'questions' && (
                                <div className="space-y-4">
                                    {myQuestions.length > 0 ? myQuestions.map(q => (
                                        <div key={q._id} className="p-4 border border-[color:var(--border-soft)] rounded-[var(--radius)]">
                                            <h4 className="font-bold text-[color:var(--text-strong)]">{q.title}</h4>
                                            <p className="text-sm text-[color:var(--text-muted)] line-clamp-2">{q.body}</p>
                                        </div>
                                    )) : <div className="text-[color:var(--text-muted)]">You haven't asked any questions yet.</div>}
                                </div>
                            )}
                            {activeTab === 'answers' && (
                                <div className="space-y-4">
                                    {myAnswers.length > 0 ? myAnswers.map(a => (
                                        <div key={a._id} className="p-4 border border-[color:var(--border-soft)] rounded-[var(--radius)]">
                                            <p className="text-sm text-[color:var(--text-strong)] line-clamp-2">"{a.body}"</p>
                                            <span className="text-xs text-[color:var(--text-muted)]">Posted on {new Date(a.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    )) : <div className="text-[color:var(--text-muted)]">You haven't contributed any answers yet.</div>}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="space-y-8">
                    <section className="p-6 text-center bg-[color:var(--bg-secondary)] rounded-[var(--radius-lg)] border border-[color:var(--border-soft)]">
                        <img src={`https://i.pravatar.cc/150?u=${user.email}`} alt="User Avatar" className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-[color:var(--border-strong)]" />
                        <h3 className="text-2xl font-semibold text-[color:var(--text-strong)]">{user.username}</h3>
                        <p className="text-[color:var(--accent-soft)] mb-4">{user.role}</p>
                        <p className="text-sm text-[color:var(--text-normal)]">{user.bio}</p>
                        <button onClick={() => setIsEditModalOpen(true)} className="mt-6 w-full font-bold py-2 px-4 rounded-[var(--radius)] border-2 border-[color:var(--border-strong)] text-[color:var(--text-normal)] hover:bg-[color:var(--border-strong)] hover:text-white transition-colors">Edit Profile</button>
                    </section>
                    <AchievementsPanel achievements={user.achievements} />

                    <div className="mt-8">
                        <h3 className="text-sm font-bold text-[color:var(--text-muted)] uppercase tracking-wider mb-4 px-2">System Tools</h3>
                        <LogsPanel />
                    </div>
                </aside>
            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Your Profile">
                <form onSubmit={handleProfileSave} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-[color:var(--text-muted)] mb-1">Username</label>
                        <input type="text" id="username" name="username" value={profileData.username} onChange={handleProfileChange} className="w-full p-2.5 input-field" />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-[color:var(--text-muted)] mb-1">Role / Title</label>
                        <input type="text" id="role" name="role" value={profileData.role} onChange={handleProfileChange} className="w-full p-2.5 input-field" />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-[color:var(--text-muted)] mb-1">Bio</label>
                        <textarea id="bio" name="bio" rows={3} value={profileData.bio} onChange={handleProfileChange} className="w-full p-2.5 input-field"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-[color:var(--accent)] text-white font-bold py-3 rounded-[var(--radius)] hover:bg-[color:var(--accent-soft)] transition-colors">Save Changes</button>
                </form>
            </Modal>

            <Modal isOpen={isAskModalOpen} onClose={handleCloseAskModal} title="Ask a Question">
                <AskQuestionModalContent onClose={handleCloseAskModal} setNotification={setNotification} preselectedCommunityId={preselectedCommunityId} />
            </Modal>
        </div>
    );
};

export default DashboardPage;