export type NotificationPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'loading';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  autoClose?: boolean;
  duration?: number;  // Duration in milliseconds
  dismissible?: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  createdAt: number;
}

export interface NotificationContextProps {
  notifications: Notification[];
  position: NotificationPosition;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
}

export interface NotificationProviderProps {
  children: React.ReactNode;
  position?: NotificationPosition;
  maxNotifications?: number;
}

export interface NotificationCenterProps {
  className?: string;
}

export interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}