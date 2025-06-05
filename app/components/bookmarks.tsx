import { clearBookmarks, createBookmark, deleteBookmark, getBookmarks, updateBookmark, type Bookmark as IBookmark } from "~/reducers/bookmarksReducer";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import { useState } from "react";
import { PenIcon, Trash2Icon, TrashIcon } from "lucide-react";
import { FormDialog } from "./dialogs/formDialog";
import { BookmarkForm } from "./forms/bookmarkForm";
import { AlertDialog } from "./dialogs/alertDialog";

export function Bookmarks() {
  const bookmarks = useAppSelector(getBookmarks);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const sortedBookmarks = [...bookmarks].sort(
    (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
  const filteredBookmarks = sortedBookmarks.filter(bookmark => {
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
    if (!name || !href) {
      toast('Must provide a name and link for the bookmark');
      return;
    }
    dispatch(createBookmark({ name, href }));
    toast.success(`Bookmark "${name}" saved`);
    setDialogOpen(false);
  }

  const onDeleteAll = () => {
    dispatch(clearBookmarks());
    toast.success('Bookmarks cleared');
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <Label htmlFor="search"></Label>
        <Input type="search" id="search" name="search" placeholder="Search in your bookmarks ..." onChange={onSearch} />
      </div>
      <div className="flex flex-col gap-2 min-h-[300px] justify-between">
        {!sortedBookmarks.length ? (
          <div className="flex flex-col gap-2 font-light text-sm">
            <p>Nothing to visit for now.</p>
            <p>Click the <Badge>Add bookmark</Badge> button below to add a bookmark.</p>
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
      <div className="flex justify-between gap-4">
        <AlertDialog
          trigger={(
            <div className="border rounded-md p-1" title="Delete all bookmark">
              <Trash2Icon className="cursor-pointer" size={16} />
            </div>
          )}
          onConfirm={onDeleteAll}
          title="Delete all bookmarks"
          description="Are you sure you want to delete *all* of your bookmarks?"
          confirm="Delete ALL of my bookmarks"
        />
        <FormDialog
          trigger={<Button>Add bookmark</Button>}
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

function Bookmark({ bookmark }: { bookmark: IBookmark }) {
  const dispatch = useAppDispatch();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const onDeleteConfirm = () => {
    dispatch(deleteBookmark(bookmark.id));
    toast.success(`Bookmark "${bookmark.name}" deleted`);
  }

  const onEditSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const href = formData.get("href") as string;
    const pinned = formData.get("pinned") === 'on';
    if (!name || !href) {
      toast('Must provide a name and link for the bookmark');
      return;
    }
    dispatch(updateBookmark({ id: bookmark.id, name, href, pinned }));
    setEditDialogOpen(false);
  }

  return (
    <div className="flex justify-between items-center gap-2 hover:bg-accent/50 rounded-sm px-3 py-1">
      <a href={bookmark.href} rel="noopener noreferrer">{bookmark.name}</a>
      <AlertDialog
        trigger={(
          <div className="border rounded-md p-1" title="Delete bookmark">
            <TrashIcon className="cursor-pointer" size={16} />
          </div>
        )}
        onConfirm={onDeleteConfirm}
        title="Delete bookmark"
        description={`Are you sure you want to delete the bookmark for "${bookmark.name}", that points to "${bookmark.href}"?`}
      />
      <FormDialog
        trigger={(
          <div className="border rounded-md p-1" title="Edit bookmark">
            <PenIcon className="cursor-pointer" size={16} />
          </div>
        )}
        onSubmit={onEditSubmit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit bookmark"
        description="Edit the name and the URL it points to."
      >
        <BookmarkForm bookmark={bookmark} />
      </FormDialog>
    </div >
  );
}
