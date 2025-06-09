import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { toast } from 'sonner';

export interface DiaryEntry {
  date: string;
  text: string;
}

export interface CalendarEvent {
  id: string;
  // date: string;
  text: string;
}

export interface CalendarState {
  diary: Record<string, DiaryEntry>
  events: Record<string, CalendarEvent[]>
}

export const initialState: CalendarState = {
  diary: {},
  events: {},
}

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    updateDiaryEntry: (state, action: PayloadAction<DiaryEntry>) => {
      if (action.payload.text.length) {
        state.diary[action.payload.date] = action.payload;
        toast.success(`Diary for ${new Date(action.payload.date).toDateString()} updated`);
      } else {
        delete state.diary[action.payload.date];
        toast.info(`Diary for ${new Date(action.payload.date).toDateString()} cleared`);
      }
    },
    addEvent: (state, action: PayloadAction<{ date: string, text: string; }>) => {
      const date = action.payload.date;
      if (!Array.isArray(state.events[date])) {
        state.events[date] = [] as CalendarEvent[];
      }
      state.events[date].push({
        // date,
        text: action.payload.text,
        id: crypto.randomUUID().slice(0, 8),
      });
      toast.success(`Event on ${new Date(action.payload.date).toDateString()} created`);
    },
    deleteEvent: (state, action: PayloadAction<CalendarEvent & { date: string }>) => {
      for (const date in state.events) {
        state.events[date] = state.events[date].filter(event => event.id !== action.payload.id);
        if (state.events[date].length === 0) {
          delete state.events[date];
        }
      }
      toast.info(`Event on ${new Date(action.payload.date).toDateString()} deleted`);
    },
    editEvent: (state, action: PayloadAction<CalendarEvent & { date: string }>) => {
      console.log(state);
      console.log(action.payload);
      const { date } = action.payload;
      if (state.events[date]) {
        const idx = state.events[date].findIndex(e => e.id === action.payload.id);
        if (idx !== -1) {
          state.events[date][idx] = action.payload;
        }
      }
      toast.success(`Event on ${new Date(action.payload.date).toDateString()} updated`);
    },
    clearCalendar: (state) => {
      state.events = {};
      state.diary = {};
      toast.success('Calendar events and diary cleared');
    },
  },
})

export const { updateDiaryEntry, addEvent, deleteEvent, editEvent, clearCalendar } = statsSlice.actions

export const getCalendarEvents = (state: RootState) => state.calendar.events;
export const getDiaryEntries = (state: RootState) => state.calendar.diary;

export default statsSlice.reducer
