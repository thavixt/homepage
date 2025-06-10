import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { toast } from 'sonner';
import type { SupportedLanguages } from '~/i18n';
import i18n from '~/i18n';

export type Setting = 'background' | 'language';
export type SettingValueType<K extends keyof SettingsState> = SettingsState[K]["value"];

type BackgroundChangeFrequency = '5min' | '15min' | '30min' | 'hour' | 'day' | 'week';
type SettingValue = BackgroundChangeFrequency | SupportedLanguages;

export interface SettingsState {
  background: SettingState<BackgroundChangeFrequency> & { counter: number },
  language: SettingState<SupportedLanguages>,
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
  language: {
    id: 'language',
    label: 'Language',
    value: 'en',
  }
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeSetting: (state, action: PayloadAction<{
      setting: Setting,
      value: SettingValue,
    }>) => {
      const stat = state[action.payload.setting];
      if (!stat) {
        // defaults
        switch (action.payload.setting) {
          case 'background': {
            state.background = {
              id: action.payload.setting,
              label: initialState[action.payload.setting].label,
              value: 'day',
              counter: 0,
            };
            break;
          }
          case 'language': {
            state.language = {
              id: action.payload.setting,
              label: initialState[action.payload.setting].label,
              value: 'en',
            };
            break;
          }
          default: {
            const message = `Unknown setting ${action.payload.setting}`;
            console.error(message);
            toast.error(message);
          }
        }
      }

      // update settings
      if (action.payload.setting === 'background') {
        state.background = {
          ...state.background,
          value: action.payload.value as BackgroundChangeFrequency,
        };
      }
      if (action.payload.setting === 'language') {
        state.language = {
          ...state.language,
          value: action.payload.value as SupportedLanguages,
        };
        i18n.changeLanguage(action.payload.value);
        window.localStorage.setItem('homepage-language', action.payload.value);
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
