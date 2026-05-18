import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CommunitiesPage from './pages/CommunitiesPage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NotificationPanel from './components/NotificationPanel';
import { User } from './types';

//---------------------------------
import OAuthSuccess from './pages/OAuthSuccess';
//----------------------------------

export type Page = 'home' | 'communities' | 'login' | 'signup' | 'dashboard' | 'communityDetail';
export type Theme = 'light' | 'dark';

const AppContent: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('threadMyDoubt-user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('theme') as Theme) || 'dark';
    });
    const [notification, setNotification] = useState('');
    const [askQuestionCommunityId, setAskQuestionCommunityId] = useState<string | number | null>(null);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleSetUser = useCallback((newUser: User | null) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem('threadMyDoubt-user', JSON.stringify(newUser));
            navigate('/dashboard');
        } else {
            localStorage.removeItem('threadMyDoubt-user');
            navigate('/');
        }
    }, [navigate]);

    const handleAskInCommunity = (communityId: string | number) => {
        setAskQuestionCommunityId(communityId);
        navigate('/dashboard');
    };

    // Helper to determine active page for Header
    const getActivePage = (): Page => {
        const path = location.pathname;
        if (path === '/') return 'home';
        if (path === '/communities') return 'communities';
        if (path === '/login') return 'login';
        if (path === '/signup') return 'signup';
        if (path === '/dashboard') return 'dashboard';
        if (path.startsWith('/community/')) return 'communityDetail';
        return 'home';
    };

    return (
        <div className="flex flex-col min-h-screen bg-[color:var(--bg-primary)] text-[color:var(--text-normal)]">
            <Header
                page={getActivePage()}
                user={user}
                setUser={handleSetUser}
                theme={theme}
                toggleTheme={toggleTheme}
            />
            <NotificationPanel message={notification} onClose={() => setNotification('')} />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/communities"
                        element={<CommunitiesPage user={user} setNotification={setNotification} />}
                    />
                    <Route
                        path="/community/:slug"
                        element={<CommunityDetailPage user={user} onAskQuestion={handleAskInCommunity} />}
                    />
                    <Route
                        path="/login"
                        element={<LoginPage setUser={handleSetUser} setNotification={setNotification} />}
                    />
                    <Route
                        path="/signup"
                        element={<SignupPage setUser={handleSetUser} setNotification={setNotification} />}
                    />

                    //----------------------------------


                    <Route path="/oauth-success" element={<OAuthSuccess setUser={handleSetUser} />} />


                    //------------------------------------
                    <Route
                        path="/dashboard"
                        element={user ? (
                            <DashboardPage
                                user={user}
                                setUser={handleSetUser}
                                setNotification={setNotification}
                                preselectedCommunityId={askQuestionCommunityId ? Number(askQuestionCommunityId) : null}
                                clearPreselectedCommunityId={() => setAskQuestionCommunityId(null)}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )}
                    />
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

const App: React.FC = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;