import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'

export type Setting = 'background';

export interface SettingsState {
  settings: Record<Setting, SettingState>
}

export interface SettingState {
  name: string;
  value: 'initial' | string;
}

export const initialState: SettingsState = {
  settings: {
    background: {
      name: 'Frequency of background change',
      value: 'hourly',
    },
  },
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeSetting: (state, action: PayloadAction<{setting: Setting, value: string}>) => {
      const stat = state.settings[action.payload.setting];
      if (stat) {
        state.settings[action.payload.setting] = {
          ...stat,
          value: action.payload.value,
        };
      } else {
        state.settings[action.payload.setting] = {
          name: initialState.settings[action.payload.setting].name,
          value: 'initial'
        };
      }
    },
    resetSettings: (state) => {
      state.settings = initialState.settings;
    }
  },
})

export const { changeSetting, resetSettings } = settingsSlice.actions

export const getSettings = (state: RootState) => state.settings.settings;

export default settingsSlice.reducer
