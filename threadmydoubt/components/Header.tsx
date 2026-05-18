import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Page, Theme } from '../App';
import type { User, Achievement } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';
import NotificationDropdown from './NotificationDropdown';
import { apiGet } from '../services/api';

interface HeaderProps {
    page: Page;
    user: User | null;
    setUser: (user: User | null) => void;
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeToggle: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className="w-10 h-10 flex items-center justify-center rounded-full text-[color:var(--text-normal)] hover:bg-[color:var(--border-soft)] transition-colors duration-300"
        aria-label="Toggle theme"
    >
        <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
    </button>
);


const CustomNavLink: React.FC<{
    active: boolean;
    to: string;
    children: React.ReactNode;
}> = ({ active, to, children }) => (
    <Link
        to={to}
        className={`font-medium text-[color:var(--text-normal)] hover:text-[color:var(--text-strong)] relative py-2 transition-colors duration-300 group`}
    >
        {children}
        <span className={`absolute bottom-0 left-0 h-0.5 bg-[color:var(--accent)] transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
    </Link>
);

const Header: React.FC<HeaderProps> = ({ page, user, setUser, theme, toggleTheme }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
    const dropdownRef = useRef<HTMLLIElement>(null);

    const handleLogout = async () => {
        try {
            await apiGet('/auth/logout');
        } catch (error) {
            console.error('Logout logging failed:', error);
        }
        setUser(null);
        navigate('/');
    };

    const totalUnlockedCount = ACHIEVEMENTS.filter(a => !!localStorage.getItem(a.id)).length;
    const lastSeenCount = parseInt(localStorage.getItem('lastSeenAchievementsCount') || '0', 10);
    const newAchievementsCount = totalUnlockedCount - lastSeenCount;

    const handleBellClick = () => {
        if (!isNotificationDropdownOpen) {
            const unlocked = ACHIEVEMENTS.filter(a => !!localStorage.getItem(a.id));
            setUnlockedAchievements(unlocked);
            localStorage.setItem('lastSeenAchievementsCount', String(unlocked.length));
        }
        setIsNotificationDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsNotificationDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const navItems = (
        <>
            <li><CustomNavLink active={page === 'communities'} to="/communities">Communities</CustomNavLink></li>
            {user ? (
                <>
                    <li><CustomNavLink active={page === 'dashboard'} to="/dashboard">Dashboard</CustomNavLink></li>
                    <li className="relative" ref={dropdownRef}>
                        <button
                            onClick={handleBellClick}
                            className="notification-bell w-10 h-10 flex items-center justify-center relative rounded-full hover:bg-[color:var(--border-soft)] transition-colors"
                            title={newAchievementsCount > 0 ? `${newAchievementsCount} new notifications!` : 'No new notifications'}
                            aria-label="Toggle notifications"
                        >
                            <i className="fas fa-bell text-lg text-[color:var(--text-normal)]"></i>
                            {newAchievementsCount > 0 && <span className="badge">{newAchievementsCount}</span>}
                        </button>
                        <NotificationDropdown
                            isOpen={isNotificationDropdownOpen}
                            achievements={unlockedAchievements}
                            onClose={() => setIsNotificationDropdownOpen(false)}
                        />
                    </li>
                    <li><button onClick={handleLogout} className="font-medium text-[color:var(--text-normal)] hover:text-[color:var(--text-strong)] transition-colors duration-300">Logout</button></li>
                </>
            ) : (
                <>
                    <li><CustomNavLink active={page === 'login'} to="/login">Login</CustomNavLink></li>
                    <li>
                        <Link to="/signup" className="bg-[color:var(--accent)] text-white px-5 py-2.5 rounded-[var(--radius)] font-medium hover:bg-[color:var(--accent-soft)] transition-all duration-300 transform hover:scale-105 shadow-[0_4px_15px_rgba(117,91,255,0.2)]">
                            Sign Up
                        </Link>
                    </li>
                </>
            )}
            <li><ThemeToggle theme={theme} toggleTheme={toggleTheme} /></li>
        </>
    );

    return (
        <header className="glass-nav border-b border-[color:var(--border-soft)] sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-[color:var(--text-strong)]">
                            Thread<span className="text-[color:var(--accent-soft)]">My</span>Doubt
                        </Link>
                    </div>

                    <nav className="hidden md:block">
                        <ul className="flex items-center space-x-6">
                            {navItems}
                        </ul>
                    </nav>

                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-2xl p-2 text-[color:var(--text-normal)]" aria-label="Open menu">
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden glass-nav border-t border-[color:var(--border-soft)]">
                    <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                        {navItems}
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;