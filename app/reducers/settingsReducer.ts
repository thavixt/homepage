import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { toast } from 'sonner';
import type { SupportedLanguage } from '~/i18n';
import i18n from '~/i18n';
import { incrementStat } from './statsReducer';
import { getBackgroundSeed } from '~/lib/background';

export type Setting = 'background' | 'language';
export type SettingValueType<K extends keyof SettingsState> = SettingsState[K]["value"];

type BackgroundChangeFrequency = '5min' | '15min' | '30min' | 'hour' | 'day' | 'week';
type SettingValue = BackgroundChangeFrequency | SupportedLanguage;

export interface SettingsState {
  background: Settings<BackgroundChangeFrequency> & { counter: number, currentUrl: string },
  language: Settings<SupportedLanguage>,
}

export interface Settings<T> {
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
    currentUrl: "",
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
              currentUrl: "",
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
          value: action.payload.value as SupportedLanguage,
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
      const backgroundSeed = getBackgroundSeed(state.background.value, state.background.counter);
      state.background.currentUrl = `https://picsum.photos/seed/${backgroundSeed}/1920/1080`;
      toast.success(`Background updated`);
      incrementStat({ stat: 'backgroundChange' });
    },
  },
})

export const { changeSetting, resetSettings, incrementBackgroundCounter } = settingsSlice.actions

export const getSettings = (state: RootState) => state.settings;
export const getBackground = (state: RootState) => state.settings.background.currentUrl;

export default settingsSlice.reducer
