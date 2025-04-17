// src/hooks/useNotificationsData.ts
import { useNotificationStore } from '../store/notificationStore';
import { useSettingsStore } from '../store/settingsStore';
import * as notificationService from '../services/notificationService';
import * as realtimeService from '../services/realtimeService';
import { Notification } from '@/types';

export function useNotificationsData() {
  const notificationStore = useNotificationStore();
  const settingsStore = useSettingsStore();

  // --- Notifications ---
  const fetchNotifications = async () => {
    try {
      notificationStore.setLoading(true);
      const notifications = await notificationService.getNotifications();
      notificationStore.setNotifications(notifications);
    } catch (error: any) {
      notificationStore.setError(error.message);
    } finally {
      notificationStore.setLoading(false);
    }
  };

  const markNotificationRead = async (id: string) => {
    notificationStore.markAsRead(id); // Optimistic update
    try {
      await notificationService.markRead(id);
    } catch (error: any) {
      console.error('Failed to mark read:', error);
    }
  };

  const markAllNotificationsRead = async () => {
    notificationStore.markAllAsRead();
    try {
      await notificationService.markAllRead();
    } catch (error: any) {
      console.error('Failed to mark all read:', error);
    }
  };

  // --- Settings ---
  const fetchSettings = async () => {
    try {
      settingsStore.setLoading(true);
      const settings = await notificationService.getSettings();
      settingsStore.setSettings(settings);
    } catch (error: any) {
      settingsStore.setError(error.message);
    } finally {
      settingsStore.setLoading(false);
    }
  };

  const updateSettings = async (data: any) => {
    try {
      settingsStore.setLoading(true);
      const updated = await notificationService.updateSettings(data);
      settingsStore.setSettings(updated);
    } catch (error: any) {
      settingsStore.setError(error.message);
    } finally {
      settingsStore.setLoading(false);
    }
  };

  // --- WebSocket ---
  let socket: any;

  const connectWebSocket = (url: string, token: string) => {
    socket = realtimeService.connect(url, token, {
      onStatusChange: notificationStore.setConnectionStatus,
    });

    realtimeService.onNotification(socket, (notif: Notification) => {
      notificationStore.addNotification(notif);
    });
  };

  const disconnectWebSocket = () => {
    if (socket) {
      realtimeService.offNotification(socket);
      realtimeService.disconnect(socket);
    }
  };

  return {
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    fetchSettings,
    updateSettings,
    connectWebSocket,
    disconnectWebSocket,
  };
}
