export interface MountProps {
  apiBaseUrl: string;
  authToken: string;
  userId: string;
  basename?: string;          // Optional base path for routing
  webSocketUrl?: string;      // Optional WebSocket URL if using real-time
}

// You can also add here other shared types as you go:
export interface Notification {
  id: string;
  message: string;
  type: string;
  channel: string;
  read: boolean;
  createdAt: string;
  relatedUrl?: string;
  isPredictive?: boolean;
}

export interface NotificationSettings {
  userId: boolean;
  notificationSounds: any;
  channels: string[];               // ["email", "inApp", "sms", ...]
  smartFiltering: boolean;
  preferencesByType?: Record<string, string[]>; // Optional advanced control
}

export interface PredictiveAlertData {
  riskLevel: 'low' | 'medium' | 'high';
  reason: string;
  suggestion: string;
}
