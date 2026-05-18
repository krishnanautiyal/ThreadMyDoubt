import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join the Conversation">
      <div className="text-center">
        <p className="text-[color:var(--text-normal)] mb-6">
          You need to be logged in to perform this action. Please log in or create an account to continue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={handleLogin} className="w-full bg-[color:var(--accent)] text-white font-bold py-3 rounded-[var(--radius)] hover:bg-[color:var(--accent-soft)] transition-colors">
            Login
          </button>
          <button onClick={handleSignup} className="w-full bg-transparent border-2 border-[color:var(--border-strong)] text-[color:var(--text-normal)] font-bold py-3 rounded-[var(--radius)] hover:bg-[color:var(--border-soft)] transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthPromptModal;
