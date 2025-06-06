import { configureStore, combineReducers, type ThunkAction, type Action } from '@reduxjs/toolkit'
import bookmarksReducer, { initialState as initialBookmarksState } from '../reducers/bookmarksReducer'
import todosReducer, { initialState as initialTodosState } from '../reducers/todosReducer'
import statsReducer, { initialState as initialStatsState } from '../reducers/statsReducer'
import settingsReducer, { initialState as initialSettingsState } from '../reducers/settingsReducer'

const preloadedState = loadState();

const rootReducer = combineReducers({
  todos: todosReducer,
  bookmarks: bookmarksReducer,
  stats: statsReducer,
  settings: settingsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
})

store.subscribe(() => {
  saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export function loadState() {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return;
  }

  const intialStoreState = {
    bookmarks: initialBookmarksState,
    settings: initialSettingsState,
    stats: initialStatsState,
    todos: initialTodosState,
  }

  try {
    const serializedState = localStorage.getItem("homepage-redux-state");
    if (serializedState === null) {
      return intialStoreState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error(err);
    return intialStoreState;
  }
}

export function saveState(state: unknown) {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return;
  }

  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("homepage-redux-state", serializedState);
  } catch (err) {
    console.error(err);
  }
}
