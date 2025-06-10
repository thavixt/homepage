import { TrashIcon, PenIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "~/hooks/state";
import { deleteBookmark, updateBookmark, type Bookmark as IBookmark } from "~/reducers/bookmarksReducer";
import { FormDialog } from "./dialogs/formDialog";
import { BookmarkForm } from "./forms/bookmarkForm";
import { AlertDialog } from "./dialogs/alertDialog";
import { incrementStat } from "~/reducers/statsReducer";
import { useTypesafeTranslation } from "~/i18n";

export function Bookmark({ bookmark }: { bookmark: IBookmark }) {
  const t = useTypesafeTranslation();
  const dispatch = useAppDispatch();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const onDeleteConfirm = () => {
    dispatch(deleteBookmark(bookmark.id));
    dispatch(incrementStat({stat: "bookmarkDeleted"}));
  }

  const onEditSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const href = formData.get("href") as string;
    const pinned = formData.get("pinned") === 'on';
    if (!name || !href) {
      toast(t('bookmark.form.required'));
      return;
    }
    dispatch(updateBookmark({ id: bookmark.id, name, href, pinned }));
    dispatch(incrementStat({stat: "bookmarkEdited"}));
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
        title={t('bookmark.delete')}
        description={t('bookmark.delete.description', {
          title: bookmark.name,
          url: bookmark.href,
        })}
        confirm={t('bookmark.delete.confirm')}
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
        title={t('bookmark.edit')}
        description={t('bookmark.edit.description')}
        submit={t('bookmark.edit.confirm')}
      >
        <BookmarkForm bookmark={bookmark} />
      </FormDialog>
    </div >
  );
}