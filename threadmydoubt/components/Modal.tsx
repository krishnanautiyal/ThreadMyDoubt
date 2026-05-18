import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="bg-[color:var(--bg-elevated)] rounded-[var(--radius-lg)] shadow-[var(--shadow-glow)] w-full max-w-md p-8 m-4 border border-[color:var(--border-strong)] transition-transform duration-300 opacity-0 -translate-y-4"
                style={{ animation: 'modal-pop 0.3s ease-out forwards' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <h3 id="modal-title" className="text-2xl font-semibold text-[color:var(--text-strong)]">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-2xl text-[color:var(--text-muted)] hover:text-[color:var(--text-normal)] transition-transform duration-200 hover:rotate-90"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
            <style>{`
                @keyframes modal-pop {
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default Modal;