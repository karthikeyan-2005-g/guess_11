import { create } from 'zustand';
import audioService from '../services/audioService';

interface SettingsStore {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  vibrationEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  setVolume: (val: number) => void;
  toggleVibration: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  soundEnabled: audioService.isSoundEnabled(),
  musicEnabled: audioService.isMusicEnabled(),
  volume: audioService.getVolume(),
  vibrationEnabled: localStorage.getItem('gte_vibration') !== 'false',

  toggleSound: () => {
    const next = !get().soundEnabled;
    audioService.setSoundEnabled(next);
    set({ soundEnabled: next });
  },

  toggleMusic: () => {
    const next = !get().musicEnabled;
    audioService.setMusicEnabled(next);
    set({ musicEnabled: next });
  },

  setVolume: (val: number) => {
    audioService.setVolume(val);
    set({ volume: val });
  },

  toggleVibration: () => {
    const next = !get().vibrationEnabled;
    localStorage.setItem('gte_vibration', String(next));
    set({ vibrationEnabled: next });
  },
}));
