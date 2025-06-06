import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'

export type Statistic =
  | 'backgroundChange'
  | 'bookmarkCreated'
  | 'bookmarkClicked'
  | 'bookmarkDeleted'
  | 'bookmarkEdited'
  | 'bookmarkImported'
  | 'hotkeyPressed'
  | 'click'
  | 'opened';

export interface StatisticsState {
  stats: Record<Statistic, StatisticState>
}

export interface StatisticState {
  description: string;
  count: number;
}

export const initialState: StatisticsState = {
  stats: {
    backgroundChange: {
      description: 'Background image manually changed',
      count: 0,
    },
    bookmarkCreated: {
      count: 0,
      description: 'Bookmarks created',
    },
    bookmarkClicked: {
      count: 0,
      description: 'Bookmarks clicked',
    },
    bookmarkDeleted: {
      count: 0,
      description: 'Bookmarks deleted',
    },
    bookmarkEdited: {
      count: 0,
      description: 'Bookmarks edited',
    },
    bookmarkImported: {
      count: 0,
      description: 'Bookmarks imported',
    },
    hotkeyPressed: {
      description: 'Hotkeys pressed',
      count: 0,
    },
    click: {
      description: 'Number of mouse clicks on this page',
      count: 0,
    },
    opened: {
      description: 'Home page opened',
      count: 1,
    },
  },
}

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    incrementStat: (state, action: PayloadAction<{ stat: Statistic, count?: number }>) => {
      const stat = state.stats[action.payload.stat];
      const inc = action.payload.count ?? 1;
      if (stat) {
        state.stats[action.payload.stat] = {
          ...stat,
          count: (stat.count ?? 0) + inc,
        };
      } else {
        state.stats[action.payload.stat] = {
          description: initialState.stats[action.payload.stat].description,
          count: inc
        };
      }
    },
    resetStats: (state) => {
      state.stats = initialState.stats;
    }
  },
})

export const { incrementStat, resetStats } = statsSlice.actions

export const getStats = (state: RootState) => state.stats.stats;

export default statsSlice.reducer
