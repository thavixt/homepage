import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'

export type Statistic = 'clicks' | 'opened';

export interface StatisticsState {
  stats: Record<Statistic, StatisticState>
}

export interface StatisticState {
  description: string;
  count: number;
}

export const initialState: StatisticsState = {
  stats: {
    clicks: {
      description: 'Click on this page',
      count: 0,
    },
    opened: {
      description: 'Home page opened',
      count: 1,
    }
  },
}

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    incrementStat: (state, action: PayloadAction<Statistic>) => {
      const stat = state.stats[action.payload];
      if (stat) {
        state.stats[action.payload] = {
          ...stat,
          count: stat.count + 1,
        };
      } else {
        state.stats[action.payload] = {
          description: initialState.stats[action.payload].description,
          count: 1
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
