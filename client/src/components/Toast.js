import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`toast toast-${type} ${visible ? 'visible' : 'hidden'}`}
      style={{ 
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease-out'
      }}
    >
      {message}
    </div>
  );
};

export default Toast; 