interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { 
        x?: number;
        y?: number;
    };
    angle?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
}

declare global {
    interface Window {
        confetti: (options: ConfettiOptions) => void;
    }
}

export function fireCelebration() {
  if (typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
  } else {
    console.error('Confetti library is not loaded on the window object.');
  }
}
