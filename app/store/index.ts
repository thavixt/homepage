import { configureStore, combineReducers, type ThunkAction, type Action } from '@reduxjs/toolkit'
import todosReducer from '../reducers/todosReducer'

const preloadedState = loadState();

const rootReducer = combineReducers({
  todos: todosReducer,
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
  try {
    const serializedState = localStorage.getItem("homepage-redux-state");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

export function saveState(state: any) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("homepage-redux-state", serializedState);
  } catch {
    // ignore write errors
  }
}
