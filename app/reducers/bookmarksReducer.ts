import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { toast } from 'sonner';

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
  ].map((bookmark, i) => ({ ...bookmark, id: `initial-${i}`, pinned: true })),
}

export const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    createBookmark: (state, action: PayloadAction<Omit<Bookmark, 'id'>>) => {
      if (state.bookmarks.find(b => b.name === action.payload.name)) {
        toast.error(`A bookmark with the same name already exists for "${action.payload.name}"`);
        return;
      }
      if (state.bookmarks.find(b => b.href === action.payload.href)) {
        toast.error(`A bookmark to the same URL already exists for "${action.payload.href}"`);
        return;
      }

      state.bookmarks = [
        ...state.bookmarks,
        {
          ...action.payload,
          id: crypto.randomUUID().slice(0, 8),
          pinned: action.payload.pinned ?? false,
        }
      ]
      toast.success(`Bookmark "${action.payload.name}" saved`);
    },
    updateBookmark: (state, action: PayloadAction<Pick<Bookmark, 'id' | 'name' | 'href' | 'pinned'>>) => {
      if (state.bookmarks.find(b => b.name === action.payload.name && b.id !== action.payload.id)) {
        toast.error(`A bookmark with the same name already exists for "${action.payload.name}"`);
        return;
      }
      if (state.bookmarks.find(b => b.href === action.payload.href && b.id !== action.payload.id)) {
        toast.error(`A bookmark to the same URL already exists for "${action.payload.href}"`);
        return;
      }

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
      toast.success(`Bookmark "${action.payload.name}" updated`);
    },
    clearBookmarks: (state) => {
      state.bookmarks = [];
      toast.success('Bookmarks cleared');
    },
    deleteBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(
        (bookmark) => bookmark.id !== action.payload
      );
      toast.success(`Bookmark deleted`);
    },
  },
})

export const { clearBookmarks, createBookmark, deleteBookmark, updateBookmark } = bookmarkSlice.actions

export const getBookmarks = (state: RootState) => state.bookmarks.bookmarks;

export default bookmarkSlice.reducer
