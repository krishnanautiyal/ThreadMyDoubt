import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Achievement } from '../types';

interface NotificationDropdownProps {
    isOpen: boolean;
    achievements: Achievement[];
    onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, achievements, onClose }) => {
    const navigate = useNavigate();
    if (!isOpen) {
        return null;
    }

    const handleViewAllClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/dashboard');
        onClose();
    };

    return (
        <div className="absolute top-full right-0 mt-3 w-80 bg-[color:var(--bg-elevated)] border border-[color:var(--border-strong)] rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] z-50 opacity-0 animate-fadeInUp" style={{ animationDuration: '0.2s', animationFillMode: 'forwards' }}>
            <div className="p-4 border-b border-[color:var(--border-soft)]">
                <h4 className="font-semibold text-[color:var(--text-strong)]">Notifications</h4>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {achievements.length > 0 ? (
                    [...achievements].reverse().map(ach => (
                        <div key={ach.id} className="flex items-start gap-4 p-4 border-b border-[color:var(--border-soft)] last:border-b-0 hover:bg-[color:var(--bg-secondary)] transition-colors">
                            <span className="text-2xl mt-1">{ach.icon}</span>
                            <div>
                                <p className="font-semibold text-[color:var(--text-strong)] leading-tight">{ach.name}</p>
                                <p className="text-xs text-[color:var(--text-muted)]">You've unlocked a new achievement!</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-[color:var(--text-muted)]">
                        <i className="fas fa-bell-slash text-3xl mb-2"></i>
                        <p>You're all caught up!</p>
                    </div>
                )}
            </div>
            {achievements.length > 0 && (
                <div className="p-2 border-t border-[color:var(--border-soft)] bg-[color:var(--bg-secondary)] rounded-b-[var(--radius-lg)]">
                    <a href="#" onClick={handleViewAllClick} className="block text-center text-sm font-semibold text-[color:var(--accent)] hover:bg-[color:var(--border-soft)] py-2 rounded-[var(--radius)] transition-colors">
                        View on Dashboard
                    </a>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;