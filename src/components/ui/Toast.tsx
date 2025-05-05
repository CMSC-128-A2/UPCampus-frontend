import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: ToastType;
  duration?: number; // Duration in milliseconds before auto-closing
}

const Toast: React.FC<ToastProps> = ({ 
  isOpen, 
  onClose, 
  message, 
  type = 'info',
  duration = 5000 // Default 5 seconds
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger animation
      setIsVisible(true);
      
      // Auto-close the toast after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          // Wait for animation to complete before removing from DOM
          setTimeout(() => {
            onClose();
          }, 300); // Match this with CSS transition time
        }, duration);
        
        // Cleanup timer on unmount or when props change
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  // Define styles and icons based on type
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-500',
          icon: 'ph:check-circle-fill',
          iconColor: 'text-green-600'
        };
      case 'error':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-500',
          icon: 'ph:warning-circle-fill',
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-500',
          icon: 'ph:warning-fill',
          iconColor: 'text-yellow-600'
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-500',
          icon: 'ph:info-fill',
          iconColor: 'text-blue-600'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex justify-center w-full max-w-md px-4 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
    >
      <div className={`flex items-center w-full p-4 rounded-lg shadow-lg border ${styles.bgColor} ${styles.borderColor}`}>
        <Icon icon={styles.icon} className={`mr-3 ${styles.iconColor}`} width="24" height="24" />
        <div className={`flex-1 ${styles.textColor} whitespace-pre-line`}>{message}</div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300);
          }}
          className="text-gray-500 hover:text-gray-700 ml-2"
        >
          <Icon icon="ph:x" width="20" height="20" />
        </button>
      </div>
    </div>
  );
};

export default Toast; 