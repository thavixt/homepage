import { BookOpenIcon, DownloadIcon, ImportIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { clearBookmarks, createBookmark, getBookmarks, type Bookmark as IBookmark } from "~/reducers/bookmarksReducer";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import { FormDialog } from "./dialogs/formDialog";
import { BookmarkForm } from "./forms/bookmarkForm";
import { AlertDialog } from "./dialogs/alertDialog";
import { Bookmark } from "./bookmark";
import { exportDataToJson, importDataFromJson, sortBy } from "~/lib/utils";
import { incrementStat } from "~/reducers/statsReducer";

export function BookmarkList() {
  const bookmarks = useAppSelector(getBookmarks);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredBookmarks = sortBy('name', bookmarks).filter(bookmark => {
    if (!searchValue) {
      return true;
    }
    return (
      bookmark.name.toLowerCase().includes(searchValue) ||
      bookmark.href.toLowerCase().includes(searchValue)
    );
  });

  const pinnedBookmarks = filteredBookmarks.filter(bookmark => bookmark.pinned);
  const otherBookmarks = filteredBookmarks.filter(bookmark => !bookmark.pinned);

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchValue(e.currentTarget.value)
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const href = formData.get("href") as string;
    const pinned = formData.get("pinned") === 'on';
    if (!name || !href) {
      toast('Must provide a name and link for the bookmark');
      return;
    }
    dispatch(createBookmark({ name, href, pinned }));
    toast.success(`Bookmark "${name}" saved`);
    setDialogOpen(false);
  }

  const onDeleteAll = () => {
    dispatch(clearBookmarks());
    dispatch(incrementStat({stat: "bookmarkDeleted", count: bookmarks.length}));
    toast.success('Bookmarks cleared');
  }

  const exportBookmarks = () => {
    exportDataToJson<IBookmark>(
      bookmarks,
      'homepage-bookmarks.json',
      'Bookmarks exported as JSON',
      ({ id: _, ...rest }) => ({ ...rest }),
    );
  }

  const importBookmarks = () => {
    importDataFromJson<IBookmark>(
      (bookmark) => {
        if (bookmark.name && bookmark.href) {
          dispatch(createBookmark(bookmark));
        }
        dispatch(incrementStat({stat: "bookmarkImported"}));
      },
      "Bookmarks imported successfully",
      "Failed to import bookmarks",
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
        <div className="flex gap-1 items-center">
          <Label htmlFor="search" className="pb-2 text-xl">Your bookmarks</Label>
          <BookOpenIcon />
        </div>
        <Input type="search" id="search" name="search" placeholder="Search for something you saved earlier..." onChange={onSearch} />
      </div>
      <div className="h-full flex flex-col gap-2 min-h-[520px] justify-between">
        {!filteredBookmarks.length ? (
          <div className="h-full my-2 flex flex-col items-center justify-center gap-8 font-light text-sm">
            <p>Nothing to visit for now.</p>
            <div className="flex flex-wrap gap-2 items-center">
              Click the
              <Badge>Add a new bookmark</Badge>
              button below to add a bookmark.
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              Click the Import button
              <ImportIcon className="cursor-pointer" size={16} />
              on the left to import your old bookmarks.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <ScrollArea className="h-[200px]">
              <Label className="pb-2">Pinned bookmarks:</Label>
              <div className="w-full grid grid-cols-2 gap-x-2 items-start justify-center">
                {pinnedBookmarks.map(bookmark => <Bookmark key={bookmark.id} bookmark={bookmark} />)}
              </div>
            </ScrollArea>
            <ScrollArea className="h-[300px]">
              <Label className="pb-2">Other bookmarks:</Label>
              <div className="w-full grid grid-cols-2 gap-x-2 items-start justify-center">
                {otherBookmarks.map(bookmark => <Bookmark key={bookmark.id} bookmark={bookmark} />)}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
      <div className="flex justify-between gap-4 items-center">
        <div className="flex gap-4 items-center">
          <AlertDialog
            trigger={(
              <div className="border rounded-md p-1" title="Delete all bookmarks">
                <Trash2Icon className="cursor-pointer" size={16} />
              </div>
            )}
            onConfirm={onDeleteAll}
            title="Delete all bookmarks"
            description="Are you sure you want to delete *all* of your bookmarks? Consider exporting them first."
            confirm="I'm sure, delete all of my bookmarks"
          />
          <div className="border rounded-md p-1" title="Export bookmarks as JSON" onClick={exportBookmarks}>
            <DownloadIcon className="cursor-pointer" size={16} />
          </div>
          <div className="border rounded-md p-1" title="Import bookmarks from JSON file" onClick={importBookmarks}>
            <ImportIcon className="cursor-pointer" size={16} />
          </div>
        </div>
        <FormDialog
          trigger={<Button>Add a new bookmark</Button>}
          onSubmit={onSubmit}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Create bookmark"
          description="Set a name for this bookmark, the website it points to, and some additional options."
        >
          <BookmarkForm />
        </FormDialog>
      </div>
    </div>
  )
}
