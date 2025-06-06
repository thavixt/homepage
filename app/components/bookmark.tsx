import { TrashIcon, PenIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "~/hooks/state";
import { deleteBookmark, updateBookmark, type Bookmark as IBookmark } from "~/reducers/bookmarksReducer";
import { FormDialog } from "./dialogs/formDialog";
import { BookmarkForm } from "./forms/bookmarkForm";
import { AlertDialog } from "./dialogs/alertDialog";
import { incrementStat } from "~/reducers/statsReducer";

export function Bookmark({ bookmark }: { bookmark: IBookmark }) {
  const dispatch = useAppDispatch();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const onDeleteConfirm = () => {
    dispatch(deleteBookmark(bookmark.id));
    dispatch(incrementStat({stat: "bookmarkDeleted"}));
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
    dispatch(incrementStat({stat: "bookmarkEdited"}));
    toast.success(`Bookmark "${bookmark.name}" updated`);
    setEditDialogOpen(false);
  }

  const onBookmarkClick = () => {
    dispatch(incrementStat({stat: "bookmarkClicked"}));
  }

  return (
    <div className="flex justify-between items-center gap-2 hover:bg-primary/10 rounded-sm px-3 py-1">
      <a href={bookmark.href} rel="noopener noreferrer" onClick={onBookmarkClick}>{bookmark.name}</a>
      <AlertDialog
        trigger={(
          <div className="border rounded-md p-1" title="Delete bookmark">
            <TrashIcon className="cursor-pointer" size={16} />
          </div>
        )}
        onConfirm={onDeleteConfirm}
        title="Delete bookmark"
        description={`Are you sure you want to delete the bookmark for "${bookmark.name}", that points to "${bookmark.href}"?`}
        confirm="Delete bookmark"
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
        submit="Save bookmark"
      >
        <BookmarkForm bookmark={bookmark} />
      </FormDialog>
    </div >
  );
}