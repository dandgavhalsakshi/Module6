// src/hooks/useNotificationCenter.ts
import { useEffect, useState } from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { useNotificationsData } from './useNotificationsData';

export function useNotificationCenter() {
  const {
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useNotificationsData();

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
  } = useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);

  const togglePopover = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isOpen]);

  return {
    isOpen,
    togglePopover,
    handleMarkAsRead,
    handleMarkAllRead,
    notifications,
    unreadCount,
    isLoading,
    error,
  };
}
