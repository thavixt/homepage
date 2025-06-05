import type { Bookmark } from "~/reducers/bookmarksReducer";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function BookmarkForm({ bookmark }: { bookmark?: Bookmark }) {
  return (
    <div className="grid gap-4 my-4">
      <div className="grid gap-3">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={bookmark?.name} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="href">Link</Label>
        <Input id="href" name="href" defaultValue={bookmark?.href ?? 'http://'} />
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-3">
        <Label htmlFor="pinned">Pinned</Label>
        <Checkbox defaultChecked={bookmark?.pinned} id="pinned" name="pinned" />
      </div>
    </div>
  )
}