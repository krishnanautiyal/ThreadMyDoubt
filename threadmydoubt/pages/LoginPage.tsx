import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';
import { authService } from '../services/authService';

interface LoginPageProps {
    setUser: (user: User) => void;
    setNotification: (message: string) => void;
}
//------------------------


const handleGoogleLogin = () => {
    window.location.href = "https://threadmydoubt.onrender.com/auth/google";
};


//------------------------


const LoginPage: React.FC<LoginPageProps> = ({ setUser, setNotification }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            setUser(response.user);
            setNotification(`👋 Welcome back, ${response.user.username}!`);
        } catch (err: any) {
            setNotification(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[color:var(--bg-secondary)] border border-[color:var(--border-soft)] rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] p-8 md:p-12 animate-fadeInUp">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold text-[color:var(--text-strong)] mb-2">Login</h2>
                    <p className="text-[color:var(--text-muted)]">Welcome back to the community.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label className="text-sm font-medium text-[color:var(--text-normal)] mb-2 block">Email</label>
                        <i className="fas fa-envelope absolute left-4 top-[2.65rem] text-[color:var(--text-muted)]"></i>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 input-field"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label className="text-sm font-medium text-[color:var(--text-normal)] mb-2 block">Password</label>
                        <i className="fas fa-lock absolute left-4 top-[2.65rem] text-[color:var(--text-muted)]"></i>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-12 py-3 input-field"
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[2.65rem] text-[color:var(--text-muted)]">
                            <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>

                    <button type="submit" className="w-full bg-[color:var(--accent)] text-white font-bold py-3 rounded-[var(--radius)] hover:bg-[color:var(--accent-soft)] transition-all duration-300 transform hover:scale-105 shadow-[0_4px_15px_rgba(117,91,255,0.2)]">
                        Sign In
                    </button>




                    
                    <div className="mt-4">
    <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 border border-[color:var(--border-soft)] py-3 rounded-[var(--radius)] hover:bg-[color:var(--bg-tertiary)] transition"
    >
        <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            className="w-5 h-5"
        />
        <span className="font-medium text-[color:var(--text-normal)]">
            Continue with Google
        </span>
    </button>
</div>
                


                </form>
                <p className="text-center text-sm text-[color:var(--text-muted)] mt-8">
                    No account yet? <Link to="/signup" className="font-semibold text-[color:var(--accent-soft)] hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;