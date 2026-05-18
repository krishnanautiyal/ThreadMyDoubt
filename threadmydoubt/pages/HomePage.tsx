import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative text-center py-32 sm:py-48 px-4 flex items-center justify-center">
                {/* Background Glow */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] bg-[color:var(--accent)] rounded-full blur-[150px] opacity-15 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="container mx-auto relative z-10">
                    <h1 className="text-4xl md:text-6xl font-semibold mb-6 text-[color:var(--text-strong)] animate-fadeInUp">
                        Ignite Your Curiosity.
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-[color:var(--text-normal)] animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                        Where questions spark innovation and communities drive discovery.
                    </p>
                    <div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp"
                        style={{ animationDelay: '400ms' }}
                    >
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full sm:w-auto bg-[color:var(--accent)] text-white font-semibold py-3 px-8 rounded-[var(--radius)] hover:bg-[color:var(--accent-soft)] transition-all duration-300 transform hover:scale-105 shadow-[0_4px_20px_rgba(117,91,255,0.25)]"
                        >
                            Ask a Question
                        </button>
                        <button
                            onClick={() => navigate('/communities')}
                            className="w-full sm:w-auto bg-transparent text-[color:var(--text-normal)] font-semibold py-3 px-8 rounded-[var(--radius)] border-2 border-[color:var(--border-strong)] hover:border-[color:var(--text-normal)] hover:text-[color:var(--text-strong)] transition-all duration-300"
                        >
                            Explore Communities
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;