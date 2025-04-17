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

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  setSettings: (settings) => set({ settings }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
