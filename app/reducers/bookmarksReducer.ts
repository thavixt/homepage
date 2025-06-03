import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'

export interface BookmarksState {
  bookmarks: Array<Bookmark>
}

export interface Bookmark {
  id: string;
  name: string;
  href: string;
}

const initialState: BookmarksState = {
  bookmarks: [],
}

export const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    createBookmark: (state, action: PayloadAction<Omit<Bookmark, 'id'>>) => {
      state.bookmarks = [
        ...state.bookmarks,
        {
          id: crypto.randomUUID().slice(0, 8),
          ...action.payload,
        }
      ]
    },
    clearBookmarks: (state) => {
      state.bookmarks = [];
    },
    deleteBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(
        (bookmark) => bookmark.id !== action.payload
      );
    },
  },
})

export const { clearBookmarks, createBookmark, deleteBookmark } = bookmarkSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.bookmark.value)`
export const getBookmarks = (state: RootState) => state.bookmarks.bookmarks;

export default bookmarkSlice.reducer
