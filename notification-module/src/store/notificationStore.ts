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

  setNotifications: (notifications: any) => {
    set({ notifications });
    get().calculateUnreadCount();
  },

  addNotification: (notification: any) => {
    set((state: { notifications: any; }) => ({
      notifications: [notification, ...state.notifications],
    }));
    get().calculateUnreadCount();
  },

  markAsRead: (id: any) => {
    set((state: { notifications: any[]; }) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
    get().calculateUnreadCount();
  },

  markAllAsRead: () => {
    set((state: { notifications: any[]; }) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
    get().calculateUnreadCount();
  },

  setLoading: (loading: any) => set({ isLoading: loading }),
  setError: (error: any) => set({ error }),
  setConnectionStatus: (status: any) => set({ connectionStatus: status }),

  calculateUnreadCount: () => {
    const count = get().notifications.filter((n: { read: any; }) => !n.read).length;
    set({ unreadCount: count });
  },
}));
