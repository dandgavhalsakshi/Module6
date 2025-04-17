// settingsStore.ts
import { create } from 'zustand';
import { NotificationSettings } from '../types';

interface SettingsStore {
  settings: NotificationSettings | null;
  isLoading: boolean;
  error: string | null;

  setSettings: (settings: NotificationSettings) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSettingsStore = create<SettingsStore>((set: (arg0: { settings?: any; isLoading?: any; error?: any; }) => any) => ({
  settings: null,
  isLoading: false,
  error: null,

  setSettings: (settings: any) => set({ settings }),
  setLoading: (loading: any) => set({ isLoading: loading }),
  setError: (error: any) => set({ error }),
}));
