import React from 'react';
import { useNotification } from '../components/NotificationContext';
import { NotificationItem } from '../components/NotificationItem';
import { NotificationCenterProps } from '../components/types';

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const { notifications, position, removeNotification } = useNotification();

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  // Determine if notifications should stack upward or downward
  const isBottomPosition = position.startsWith('bottom');
  const sortedNotifications = [...notifications].sort((a, b) => 
    isBottomPosition ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
  );

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed z-50 flex flex-col gap-2 w-full max-w-sm ${getPositionClasses()} ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {sortedNotifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};