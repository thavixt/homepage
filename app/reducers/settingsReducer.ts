import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { toast } from 'sonner';

export type Setting = 'background';
export type BackgroundChangeFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type BackgroundSettings = SettingState<BackgroundChangeFrequency> & { counter: number };

export interface SettingsState {
  settings: {
    background: BackgroundSettings,
  }
}

export interface SettingState<T> {
  id: Setting;
  name: string;
  value: T;
}

export const initialState: SettingsState = {
  settings: {
    background: {
      id: 'background',
      name: 'Frequency of background change',
      value: 'hourly',
      counter: 0,
    },
  },
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeSetting: (state, action: PayloadAction<{ setting: Setting, value: BackgroundChangeFrequency }>) => {
      const stat = state.settings[action.payload.setting];
      if (stat) {
        state.settings[action.payload.setting] = {
          ...stat,
          value: action.payload.value,
        };
      } else {
        if (action.payload.setting === 'background') {
          state.settings[action.payload.setting] = {
            id: action.payload.setting,
            name: initialState.settings[action.payload.setting].name,
            value: 'daily',
            counter: 0,
          };
        } else {
          const message = `Unknown setting ${action.payload.setting}`;
          console.error(message);
          toast.error(message);
        }
      }
    },
    resetSettings: (state) => {
      state.settings = initialState.settings;
    },
    incrementBackgroundCounter: (state) => {
      state.settings.background.counter++;
    }
  },
})

export const { changeSetting, resetSettings, incrementBackgroundCounter } = settingsSlice.actions

export const getSettings = (state: RootState) => state.settings.settings;

export default settingsSlice.reducer
