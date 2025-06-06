import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { Route } from "./+types/home";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { getStats, resetStats } from "~/reducers/statsReducer";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { sortBy } from "~/lib/utils";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Homepage - Statistics" },
    { name: "description", content: "Statistics collected on your home page" },
  ];
}

export default function Stats() {
  const stats = useAppSelector(getStats);
  const dispatch = useAppDispatch();

  const onReset = () => {
    if (confirm('Are you sure you want to reset the statistics?')) {
      dispatch(resetStats());
      toast.success('Statistics reset');
    }
  }

  return (
    <Card className="w-[500px]">
      <CardHeader className="w-full text-center font-bold text-4xl">
        Statistics collected
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <ul>
          {sortBy('description', Object.values(stats))
            .map((stat) => (
              <li key={stat.description}>{stat.description}: {stat.count}</li>
            ))}
        </ul>
        <div className="flex flex-col gap-4 justify-between items-center w-full">
          <Button variant="outline" onClick={onReset}>Reset statistics</Button>
        </div>
      </CardContent>
    </Card>
  );
}
