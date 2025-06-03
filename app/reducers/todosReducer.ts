import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'

export type TodoStatus = 'initial' | 'inprogress' | 'completed' | 'cancelled';

export interface TodoState {
  todos: Array<Todo>
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: TodoStatus;
  completed: string | null;
}

const initialState: TodoState = {
  todos: [],
}

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    createTodo: (state, action: PayloadAction<Omit<Todo, 'id' | 'status' | 'completed'>>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      // state.value += 1
      console.log('add todo', action.payload);
      state.todos.push({
        id: crypto.randomUUID().slice(0, 8),
        status: 'initial',
        completed: null,
        ...action.payload,
      })
    },
    startTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.map(todo => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            status: 'inprogress'
          }
        }
        return todo;
      })
    },
    completeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.map(todo => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            status: 'completed'
          }
        }
        return todo;
      })
    },
    cancelTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.map(todo => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            status: 'cancelled'
          }
        }
        return todo;
      })
    }
  },
})

export const { createTodo, cancelTodo, completeTodo, startTodo } = todoSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.todo.value)`
export const getTodos = (state: RootState) => state.todos.todos

export default todoSlice.reducer
