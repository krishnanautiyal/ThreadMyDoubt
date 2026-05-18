import React, { useEffect, useState } from 'react';

interface NotificationPanelProps {
  message: string;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 400); // Wait for animation to finish
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
      return null;
  }

  return (
    <div
      className="notification-panel"
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
      }}
    >
      <span>{message}</span>
    </div>
  );
};

export default NotificationPanel;
