import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[color:var(--bg-secondary)] text-[color:var(--text-muted)] border-t border-[color:var(--border-soft)] mt-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-2xl font-bold text-[color:var(--text-strong)]">
                        Thread<span className="text-[color:var(--accent-soft)]">My</span>Doubt
                    </div>
                    <div className="flex space-x-6 font-medium text-[color:var(--text-normal)]">
                        <a href="#" className="hover:text-[color:var(--accent)] transition-colors">About</a>
                        <a href="#" className="hover:text-[color:var(--accent)] transition-colors">Contact</a>
                        <a href="#" className="hover:text-[color:var(--accent)] transition-colors">Privacy Policy</a>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-[color:var(--border-strong)] text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} ThreadMyDoubt. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;