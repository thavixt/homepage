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

export const initialState: TodoState = {
  todos: [],
}

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    createTodo: (state, action: PayloadAction<Omit<Todo, 'id' | 'status' | 'completed'>>) => {
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
    },
    clearTodos: (state) => {
      state.todos = []
    },
  },
})

export const { createTodo, cancelTodo, completeTodo, startTodo, clearTodos } = todoSlice.actions

export const getTodos = (state: RootState) => state.todos.todos

export default todoSlice.reducer
