import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { getStats, resetStats } from "~/reducers/statsReducer";
import { toast } from "sonner";
import { sortBy } from "~/lib/utils";
import { AlertDialog } from "~/components/dialogs/alertDialog";
import { ArchiveXIcon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

export function meta() {
  return [
    { title: "Homepage - Statistics" },
    { name: "description", content: "Statistics collected on your home page" },
  ];
}

export default function Stats() {
  const stats = useAppSelector(getStats);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');
  const sortedStats = sortBy('description', Object.values(stats));
  const filteredStats = sortedStats.filter(stat => stat.description.toLowerCase().includes(searchValue.toLowerCase()));

  const onReset = () => {
    dispatch(resetStats());
    toast.success('All collected stats have been reset');
  }

  return (
    <Card className="w-full max-w-xl flex flex-col items-center min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        Statistics collected
      </CardHeader>
      <CardContent className="flex flex-col gap-4 w-full px-0">
        <div className="w-full grid grid-cols-[1fr_2fr] px-8">
          <Label htmlFor="stat">Search for a statistic:</Label>
          <Input
            autoFocus
            name="stat"
            id="stat"
            placeholder="Search..."
            onChange={(e) => setSearchValue(e.currentTarget.value)}
          />
        </div>
        <Separator />
        <ScrollArea className="h-[400px] w-full px-8">
          <div className="grid grid-cols-[8fr_2fr] gap-1 items-start">
            {filteredStats
              .map((stat) => (
                <Fragment key={stat.description}>
                  <div className="truncate">{stat.description}:</div>
                  <div>{stat.count} times</div>
                </Fragment>
              ))}
          </div>
        </ScrollArea>
        <Separator />
        <div className="flex flex-col gap-4 justify-between items-center w-full px-8">
          <AlertDialog
            trigger={(
              <div className="border rounded-md p-1" title="Reset statistics">
                <ArchiveXIcon className="cursor-pointer" size={16} />
              </div>
            )}
            onConfirm={onReset}
            title="Reset statistics"
            description="Reset all the statistics collected so far?"
            confirm="Yes"
          />
        </div>
      </CardContent>
    </Card>
  );
}
