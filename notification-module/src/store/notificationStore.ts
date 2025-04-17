// notificationStore.ts
import { create } from 'zustand';
import { Notification } from '../types';

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  connectionStatus: ConnectionStatus;

  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  calculateUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  connectionStatus: 'disconnected',

  setNotifications: (notifications) => {
    set({ notifications });
    get().calculateUnreadCount();
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
    get().calculateUnreadCount();
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
    get().calculateUnreadCount();
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
    get().calculateUnreadCount();
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),

  calculateUnreadCount: () => {
    const count = get().notifications.filter((n) => !n.read).length;
    set({ unreadCount: count });
  },
}));
