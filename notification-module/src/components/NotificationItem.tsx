// components/NotificationItem.tsx

import React, { useState, useEffect } from 'react';
import { 
  NotificationItemProps, 
  NotificationType 
} from '../components/types';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onClose 
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progressWidth, setProgressWidth] = useState(100);
  const { type, title, message, dismissible, duration, action, icon } = notification;

  // Handle close with animation
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // match the transition duration
  };

  // Progress bar animation
  useEffect(() => {
    if (!duration || duration <= 0) return;
    
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const percent = (remaining / duration) * 100;
      
      setProgressWidth(percent);
      
      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };
    
    const animationId = requestAnimationFrame(updateProgress);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [duration]);

  const getTypeClasses = (): string => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-400 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-400 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'loading':
        return 'bg-blue-50 border-blue-400 text-blue-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-400 text-blue-800';
    }
  };

  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'loading':
        return (
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'info':
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getProgressBarClasses = (): string => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'loading':
        return 'bg-blue-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div 
      className={`
        rounded-lg border shadow-md overflow-hidden
        transition-all duration-300 ease-in-out transform
        ${getTypeClasses()}
        ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
      `}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-full pr-6">
            {title && (
              <h3 className="text-sm font-medium">
                {title}
              </h3>
            )}
            <div className={`text-sm ${title ? 'mt-1' : ''}`}>
              {message}
            </div>
            {action && (
              <div className="mt-2">
                <button
                  onClick={action.onClick}
                  className="text-sm font-medium underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          {dismissible && (
            <button
              type="button"
              className="absolute top-2 right-2 rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleClose}
              aria-label="Close"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar for auto-close notifications */}
      {notification.autoClose && notification.duration && (
        <div className="h-1 w-full bg-gray-200">
          <div 
            className={`h-full ${getProgressBarClasses()} transition-all ease-linear`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      )}
    </div>
  );
};