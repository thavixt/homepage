import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { toast } from 'sonner';

export type Setting = 'background';

export type BackgroundChangeFrequency = '5min' | '15min' | '30min' | 'hour' | 'day' | 'week';

export type BackgroundSettings = SettingState<BackgroundChangeFrequency> & { counter: number };

export interface SettingsState {
  background: BackgroundSettings,
}

export interface SettingState<T> {
  id: Setting;
  label: string;
  value: T;
}

export const initialState: SettingsState = {
  background: {
    id: 'background',
    label: 'Change background every',
    value: 'hour',
    counter: 0,
  },
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeSetting: (state, action: PayloadAction<{
      setting: Setting,
      value: BackgroundChangeFrequency,
    }>) => {
      const stat = state[action.payload.setting];
      if (stat) {
        state[action.payload.setting] = {
          ...stat,
          value: action.payload.value,
        };
      } else {
        if (action.payload.setting === 'background') {
          state[action.payload.setting] = {
            id: action.payload.setting,
            label: initialState[action.payload.setting].label,
            value: 'day',
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
      state.background = initialState.background;
      toast.success('Setting reset to defaults');
    },
    incrementBackgroundCounter: (state) => {
      state.background.counter++;
    }
  },
})

export const { changeSetting, resetSettings, incrementBackgroundCounter } = settingsSlice.actions

export const getSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer
