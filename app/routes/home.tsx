import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { clearBookmarks, createBookmark, deleteBookmark, getBookmarks } from "~/reducers/bookmarksReducer";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label"; import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { toast } from "sonner";
import { CalendarIcon, CheckCircleIcon, CloudSunIcon, NotebookPenIcon, TrashIcon } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import { Clock, getCurrentDate } from "~/components/clock";
import { WeatherWidget } from "~/components/weather";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to the internet" },
  ];
}

export default function Home() {
  return (
    <Card className="w-full max-w-5xl flex flex-col items-center gap-8 min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        <div className="flex gap-4 items-center justify-between">
          <span className="inline">{getCurrentDate()}</span>
          <Clock />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-1 md:grid-cols-[1fr_auto_2fr] gap-8 w-full space-y-6 px-4">
        <div className="flex flex-col gap-6">
          <WeatherWidget />
          <ul>
            <li>
              <Link className="link flex gap-2 items-center" to="todos">
                <CheckCircleIcon className="inline" size={16} />
                <span>Todos</span>
              </Link>
            </li>
            <li>
              <Link className="link flex gap-2 items-center" to="notes">
                <NotebookPenIcon className="inline" size={16} />
                <span>Notes</span>
              </Link>
            </li>
            <li>
              <Link className="link flex gap-2 items-center" to="calendar">
                <CalendarIcon className="inline" size={16} />
                <span>Calendar</span>
              </Link>
            </li>
            <li>
              <Link className="link flex gap-2 items-center" to="weather">
                <CloudSunIcon className="inline" size={16} />
                <span>Weather forcast</span>
              </Link>
            </li>
          </ul>
          <div>
            <p className="pb-2 font-light">Frequent resources for development:</p>
            <ul>
              {resources.map(({ href, name: text }) => (
                <li key={href}>
                  <a href={href} rel="noreferrer">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator orientation="vertical" />
        <div className="flex">
          <Favourites />
        </div>
      </CardContent>
    </Card>
  );
}

const resources = [
  {
    href: "https://reactrouter.com/docs",
    name: "React Router docs",
  },
  {
    href: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts",
    name: "Redux docs",
  },
  {
    href: 'https://tailwindcss.com/docs/installation/using-vite',
    name: 'Tailwind docs'
  },
  {
    href: 'https://ui.shadcn.com/',
    name: 'Shadcn docs'
  }
].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

function Favourites() {
  const bookmarks = useAppSelector(getBookmarks);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
  })

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
    setDialogOpen(false);
  }

  const onClear = () => {
    if (confirm('Are you sure you want to delete ALL your bookmarks?')) {
      toast.success('Bookmarks cleared');
      dispatch(clearBookmarks());
    }
  }

  const onDelete: React.MouseEventHandler<SVGSVGElement> = (e) => {
    if (confirm(`Are you sure you want to delete the bookmark "${e.currentTarget.dataset.name}"?`)) {
      toast.success(`Bookmark "${e.currentTarget.dataset.name}" deleted`);
      dispatch(deleteBookmark(e.currentTarget.dataset.id as string));
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <Label htmlFor="search"></Label>
        <Input type="search" id="search" name="search" placeholder="Search in your bookmarks ..." onChange={onSearch} />
      </div>
      <div className="flex flex-col gap-2 min-h-[300px] justify-between">
        <div>Your bookmarks:</div>
        {!sortedBookmarks.length ? (
          <div className="flex flex-col gap-2 font-light text-sm">
            <p>Nothing to visit for now.</p>
            <p>Click the <Badge>Add bookmark</Badge> button below to add a bookmark.</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="w-full grid grid-cols-2 gap-x-2 items-start justify-center">
              {filteredBookmarks.map(bookmark => (
                <div key={bookmark.id} className="flex justify-between items-center gap-2 hover:bg-accent rounded-sm px-3 py-1">
                  <a
                    href={bookmark.href}
                    rel="noopener noreferrer"
                  >
                    {bookmark.name}
                  </a>
                  <TrashIcon data-id={bookmark.id} data-name={bookmark.name} className="cursor-pointer" size={16} onClick={onDelete} />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      <div className="flex justify-between gap-4">
        <Button variant="ghost" onClick={onClear}>Clear bookmarks</Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add bookmark</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form ref={formRef} onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>Create bookmark</DialogTitle>
                <DialogDescription>
                  Set the name of it and the website it points to.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 my-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="href">Link</Label>
                  <Input id="href" name="href" defaultValue="https://" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}