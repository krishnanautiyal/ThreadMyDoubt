import React, { useState } from 'react';
import { apiGet, apiDelete } from '../services/api';

const LogsPanel: React.FC = () => {
    const [showLogs, setShowLogs] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const formatLogMessage = (log: any) => {
        const time = new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const username = log.username || 'Someone';
        const title = log.title ? `: '${log.title}'` : '';

        switch (log.event) {
            case 'POST_CREATION':
                return `${time} – ${username} posted a question${title}`;
            case 'ANSWER_CREATION':
                return `${time} – ${username} posted an answer${log.title ? ` to '${log.title}'` : ''}`;
            case 'VOTE_CAST':
                return `${time} – ${username} upvoted a post${log.title ? ` on '${log.title}'` : ''}`;
            case 'USER_LOGIN':
                return `${time} – ${username} logged in`;
            case 'USER_SIGNUP':
                return `${time} – ${username} joined the platform!`;
            case 'ACHIEVEMENT_UNLOCKED':
                return `${time} – ${username} unlocked an achievement: ${log.title}`;
            case 'LOGS_CLEARED':
                return `${time} – ${username} cleared the system logs`;
            case 'SERVER_ERROR':
                return `${time} – System Error: ${log.title}`;
            case 'COMMENT_CREATION':
                return `${time} – ${username} added a comment${title}`;
            default:
                return `${time} – ${username} performed ${log.event.replace(/_/g, ' ').toLowerCase()}`;
        }
    };

    const handleViewLogs = async () => {
        setLoading(true);
        setShowLogs(true);
        try {
            const response = await apiGet('/logs');
            console.log('Logs response:', response);
            setLogs(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
            // Handle error by showing an empty list or error message
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadLogs = () => {
        const storedUser = localStorage.getItem('threadMyDoubt-user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.token) {
                    fetch('https://threadmydoubt.onrender.com/api/logs/download', {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                        .then(response => {
                            if (!response.ok) throw new Error('Download failed');
                            return response.blob();
                        })
                        .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = 'activity.log';
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            a.remove();
                        })
                        .catch(err => {
                            console.error('Download failed', err);
                            alert('Log download failed');
                        });
                }
            } catch (e) {
                console.error('Error parsing user for download', e);
            }
        }
    };

    const handleClearLogs = async () => {
        if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
            try {
                await apiDelete('/logs/clear');
                setLogs([]);
                alert('Logs cleared successfully');
            } catch (error) {
                console.error('Clear logs error:', error);
                alert('Failed to clear logs');
            }
        }
    };

    return (
        <section className="bg-[color:var(--bg-secondary)] p-6 rounded-[var(--radius-lg)] border border-[color:var(--border-soft)] shadow-md">
            <h3 className="text-xl font-semibold text-[color:var(--text-strong)] mb-4 flex items-center gap-2">
                <i className="fas fa-history text-[color:var(--accent-soft)]"></i>
                Activity Feed
            </h3>

            <div className="flex items-center gap-4 mb-4">
                <button
                    onClick={handleViewLogs}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--bg-primary)] border border-[color:var(--border-soft)] text-blue-500 hover:bg-blue-500 hover:text-white transition-all cursor-pointer shadow-sm group"
                    title="Refresh Feed"
                >
                    <i className="fas fa-sync-alt group-hover:rotate-180 transition-transform duration-500"></i>
                </button>

                <button
                    onClick={handleDownloadLogs}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--bg-primary)] border border-[color:var(--border-soft)] text-green-500 hover:bg-green-500 hover:text-white transition-all cursor-pointer shadow-sm group"
                    title="Download Logs"
                >
                    <i className="fas fa-download group-hover:scale-110"></i>
                </button>

                <button
                    onClick={handleClearLogs}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--bg-primary)] border border-[color:var(--border-soft)] text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm group"
                    title="Clear Logs"
                >
                    <i className="fas fa-trash-alt group-hover:scale-110"></i>
                </button>
            </div>

            {showLogs && (
                <div className="mt-4 animate-fadeInUp">
                    <div className="flex justify-between items-center mb-2 px-2">
                        <span className="text-xs font-medium text-[color:var(--text-muted)] uppercase tracking-wider">Recent Activity</span>
                        <button
                            onClick={() => setShowLogs(false)}
                            className="text-xs text-red-400 hover:text-red-500 hover:underline flex items-center gap-1"
                        >
                            <i className="fas fa-times"></i> Hide
                        </button>
                    </div>
                    <div className="bg-[color:var(--bg-primary)] rounded-lg border border-[color:var(--border-soft)] overflow-hidden shadow-inner">
                        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[color:var(--border-soft)] px-2 py-3">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-8 text-[color:var(--text-muted)]">
                                    <i className="fas fa-circle-notch animate-spin text-2xl mb-2 text-[color:var(--accent-soft)]"></i>
                                    <span className="text-sm">Fetching and formatting activity...</span>
                                </div>
                            ) : logs.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {logs.map((log, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 rounded-md hover:bg-[color:var(--bg-secondary)] transition-colors border-l-4 border-[color:var(--accent-soft)] bg-[color:var(--bg-primary)] shadow-sm">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[color:var(--bg-secondary)] flex items-center justify-center text-[color:var(--accent-soft)] text-xs border border-[color:var(--border-soft)]">
                                                <i className={`fas ${log.event === 'POST_CREATION' ? 'fa-plus' :
                                                        log.event === 'ANSWER_CREATION' ? 'fa-comment-alt' :
                                                            log.event === 'VOTE_CAST' ? 'fa-heart' :
                                                                log.event === 'USER_LOGIN' ? 'fa-sign-in-alt' :
                                                                    log.event === 'USER_SIGNUP' ? 'fa-user-plus' :
                                                                        log.event === 'ACHIEVEMENT_UNLOCKED' ? 'fa-trophy' :
                                                                            log.event === 'SERVER_ERROR' ? 'fa-exclamation-triangle' :
                                                                                'fa-info-circle'
                                                    }`}></i>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-sm text-[color:var(--text-strong)] leading-relaxed">
                                                    {formatLogMessage(log)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-[color:var(--text-muted)] italic text-sm">
                                    No activity logs found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default LogsPanel;
