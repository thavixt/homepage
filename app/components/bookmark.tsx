import { TrashIcon, PenIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "~/hooks/state";
import { deleteBookmark, updateBookmark, type Bookmark as IBookmark } from "~/reducers/bookmarksReducer";
import { FormDialog } from "./dialogs/formDialog";
import { BookmarkForm } from "./forms/bookmarkForm";
import { AlertDialog } from "./dialogs/alertDialog";
import { incrementStat } from "~/reducers/statsReducer";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card"
import { Button } from "./ui/button";

export function Bookmark({ bookmark }: { bookmark: IBookmark }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const onDeleteConfirm = () => {
    dispatch(deleteBookmark(bookmark.id));
    dispatch(incrementStat({ stat: "bookmarkDeleted" }));
  }

  const onEditSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const href = formData.get("href") as string;
    const abbrev = formData.get("abbrev") as string;
    const pinned = formData.get("pinned") === 'on';
    if (!name || !href) {
      toast(t('bookmark.form.required'));
      return;
    }
    dispatch(updateBookmark({ id: bookmark.id, name, href, pinned, abbrev }));
    dispatch(incrementStat({ stat: "bookmarkEdited" }));
    setEditDialogOpen(false);
  }

  const onBookmarkClick = () => {
    dispatch(incrementStat({ stat: "bookmarkClicked" }));
  }

  return (
    <div className="h-8 w-full flex justify-between items-center gap-2 hover:bg-primary/10 rounded-sm px-3 py-5">
      <div className="flex w-full">
        <HoverCard>
          <HoverCardTrigger
            href={bookmark.href}
            rel="noopener noreferrer"
            onClick={onBookmarkClick}
          >
            <div className="flex gap-1 items-center justify-start">
              <Avatar className="w-8 h-8 rounded-full">
                <AvatarImage src={getBookmarkImage(bookmark.abbrev ?? bookmark.name)} alt="@shadcn" />
              </Avatar>
              <div className="truncate">{bookmark.name}</div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent align="center" side="bottom" className="w-fit flex flex-col gap-4 items-start">
            <div>
              <p><b>{bookmark.name}</b></p>
              <p><small><code>{bookmark.href}</code></small></p>
            </div>
            <div className="flex gap-2 items-center justify-center text-white">
              <AlertDialog
                triggerAsChild
                trigger={(
                  <Button variant="ghost" size="sm" title="Delete bookmark">
                    <span>Delete</span>
                    <TrashIcon size={16} />
                  </Button>
                )}
                onConfirm={onDeleteConfirm}
                title={t('bookmark.delete.title')}
                description={t('bookmark.delete.description', {
                  title: bookmark.name,
                  url: bookmark.href,
                  interpolation: { escapeValue: false }
                })}
                confirm={t('bookmark.delete.confirm')}
              />
              <FormDialog
                trigger={(
                  <Button variant="outline" size="sm" title="Delete bookmark">
                    <span>Edit</span>
                    <PenIcon size={16} />
                  </Button>
                )}
                onSubmit={onEditSubmit}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                title={t('bookmark.edit.title')}
                description={t('bookmark.edit.description')}
                submit={t('bookmark.edit.confirm')}
              >
                <BookmarkForm bookmark={bookmark} />
              </FormDialog>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}

function getBookmarkImage(bookmarkTitle: string) {
  return [
    `https://ui-avatars.com/api/`,
    `?name=${bookmarkTitle}`,
    `&length=3`,
    `&uppercase=false`,
    `&bold=true`,
    `&background=303030`,
    `&color=c0c0c0`,
  ].join('');
}
