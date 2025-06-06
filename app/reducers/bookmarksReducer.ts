import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'

export interface BookmarksState {
  bookmarks: Array<Bookmark>
}

export type Bookmark = {
  id: string;
  name: string;
  href: string;
  pinned?: boolean;
}

export const initialState: BookmarksState = {
  bookmarks: [
    {
      href: "https://reactrouter.com/docs",
      name: "React Router",
    },
    {
      href: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts",
      name: "Redux",
    },
    {
      href: "https://lucide.dev/icons",
      name: "Lucide",
    },
    {
      href: "https://tailwindcss.com/docs/installation/using-vite",
      name: "Tailwindcss",
    },
    {
      href: "https://tanstack.com/query/latest/docs/framework/react/installation",
      name: "TanStack Query",
    },
    {
      href: "https://ui.shadcn.com/",
      name: "Shadcn",
    },
    {
      href: "https://vercel.com/",
      name: "Vercel",
    },
    {
      href: "https://vite.dev/guide/#scaffolding-your-first-vite-project",
      name: "Vite",
    },
  ].map((bookmark, i) => ({ ...bookmark, id: `initial-${i}`, pinned: true})),
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
    updateBookmark: (state, action: PayloadAction<Pick<Bookmark, 'id' | 'name' | 'href' | 'pinned'>>) => {
      const updatedBookmarks = state.bookmarks.map((bookmark) => {
        if (bookmark.id === action.payload.id) {
          return {
            ...bookmark,
            ...action.payload,
          }
        }
        return bookmark;
      });
      state.bookmarks = updatedBookmarks;
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

export const { clearBookmarks, createBookmark, deleteBookmark, updateBookmark } = bookmarkSlice.actions

export const getBookmarks = (state: RootState) => state.bookmarks.bookmarks;

export default bookmarkSlice.reducer
