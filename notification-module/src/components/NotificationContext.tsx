
// export const useNotifications = () => {
//     const context = useContext(NotificationContext);
    
//     if (context === undefined) {
//       throw new Error('useNotifications must be used within a NotificationProvider');
//     }
    
//     return context;
//   };
// contexts/NotificationContext.tsx
// import React, { createContext, useReducer, useEffect, useState, useCallback } from 'react';
// import { Notification, NotificationSettings, NotificationResponse } from '../types';

// // Default settings
// const DEFAULT_SETTINGS: NotificationSettings = {
//   userId: '',
//   emailNotifications: true,
//   pushNotifications: true,
//   inAppNotifications: true,
//   notificationSounds: true,
//   groupNotifications: false,
//   frequency: 'immediate'
// };

// // Define the shape of our context
// interface NotificationContextType {
//   notifications: Notification[];
//   settings: NotificationSettings;
//   addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
//   markAsRead: (id: string) => void;
//   markAllAsRead: () => void;
//   deleteNotification: (id: string) => void;
//   clearAllNotifications: () => void;
//   updateSettings: (settings: NotificationSettings) => void;
// }

// // Create the context
// export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// // Action types for our reducer
// type NotificationAction =
//   | { type: 'ADD_NOTIFICATION'; payload: Notification }
//   | { type: 'MARK_AS_READ'; payload: string }
//   | { type: 'MARK_ALL_AS_READ' }
//   | { type: 'DELETE_NOTIFICATION'; payload: string }
//   | { type: 'CLEAR_ALL' }
//   | { type: 'SET_NOTIFICATIONS'; payload: Notification[] };

// // Reducer function to handle state updates
// const notificationReducer = (state: Notification[], action: NotificationAction): Notification[] => {
//   switch (action.type) {
//     case 'ADD_NOTIFICATION':
//       return [action.payload, ...state];
//     case 'MARK_AS_READ':
//       return state.map(notification =>
//         notification.id === action.payload ? { ...notification, isRead: true } : notification
//       );
//     case 'MARK_ALL_AS_READ':
//       return state.map(notification => ({ ...notification, isRead: true }));
//     case 'DELETE_NOTIFICATION':
//       return state.filter(notification => notification.id !== action.payload);
//     case 'CLEAR_ALL':
//       return [];
//     case 'SET_NOTIFICATIONS':
//       return action.payload;
//     default:
//       return state;
//   }
// };

// // Storage keys
// const STORAGE_KEY_NOTIFICATIONS = 'app_notifications';
// const STORAGE_KEY_SETTINGS = 'app_notification_settings';

// // Provider component
// export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [notifications, dispatch] = useReducer(notificationReducer, []);
//   const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
//   const [isInitialized, setIsInitialized] = useState(false);

//   // Load notifications and settings from storage on mount
//   useEffect(() => {
//     const loadedNotifications = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
//     const loadedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);

//     if (loadedNotifications) {
//       try {
//         const parsedNotifications = JSON.parse(loadedNotifications);
//         // Convert string timestamps back to Date objects
//         const notificationsWithDates = parsedNotifications.map((n: any) => ({
//           ...n,
//           timestamp: new Date(n.timestamp)
//         }));
//         dispatch({ type: 'SET_NOTIFICATIONS', payload: notificationsWithDates });
//       } catch (error) {
//         console.error('Failed to parse stored notifications:', error);
//       }
//     }

//     if (loadedSettings) {
//       try {
//         const parsedSettings = JSON.parse(loadedSettings);
//         setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
//       } catch (error) {
//         console.error('Failed to parse stored settings:', error);
//       }
//     }

//     // Fetch user ID from auth service or generate one
//     const getUserId = async () => {
//       // In a real app, this would be from your authentication service
//       const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
//       if (!localStorage.getItem('userId')) {
//         localStorage.setItem('userId', userId);
//       }
//       setSettings(prev => ({ ...prev, userId }));
//     };

//     getUserId();
//     setIsInitialized(true);
//   }, []);

//   // Save notifications to storage whenever they change
//   useEffect(() => {
//     if (isInitialized) {
//       localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
//     }
//   }, [notifications, isInitialized]);

//   // Save settings to storage whenever they change
//   useEffect(() => {
//     if (isInitialized && settings.userId) {
//       localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
//     }
//   }, [settings, isInitialized]);

//   // Add a new notification
//   const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
//     const newNotification: Notification = {
//       ...notification,
//       id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       timestamp: new Date(),
//       isRead: false,
//       userId: settings.userId
//     };

//     dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

//     // If sound is enabled, play a notification sound
//     if (settings.notificationSounds) {
//       // You could implement sound playing logic here
//       // e.g., new Audio('/notification-sound.mp3').play();
//     }
//   }, [settings.userId, settings.notificationSounds]);

//   // Mark a notification as read
//   const markAsRead = useCallback((id: string) => {
//     dispatch({ type: 'MARK_AS_READ', payload: id });
//   }, []);

//   // Mark all notifications as read
//   const markAllAsRead = useCallback(() => {
//     dispatch({ type: 'MARK_ALL_AS_READ' });
//   }, []);

//   // Delete a notification
//   const deleteNotification = useCallback((id: string) => {
//     dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
//   }, []);

//   // Clear all notifications
//   const clearAllNotifications = useCallback(() => {
//     dispatch({ type: 'CLEAR_ALL' });
//   }, []);

//   // Update notification settings
//   const updateSettings = useCallback((newSettings: NotificationSettings) => {
//     setSettings(prev => ({ ...prev, ...newSettings }));
//   }, []);

//   // Provide context value
//   const contextValue: NotificationContextType = {
//     notifications,
//     settings,
//     addNotification,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//     clearAllNotifications,
//     updateSettings
//   };

//   return (
//     <NotificationContext.Provider value={contextValue}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };