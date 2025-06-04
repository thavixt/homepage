import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { Route } from "./+types/home";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { changeSetting, getSettings, resetSettings, type Setting } from "~/reducers/settingsReducer";
import { Fragment } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { clearBookmarks } from "~/reducers/bookmarksReducer";
import { clearTodos } from "~/reducers/todosReducer";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Statistics" },
    { name: "description", content: "Statistics collected on your home page" },
  ];
}

export default function Stats() {
  const settings = useAppSelector(getSettings);
  const dispatch = useAppDispatch();

  const onReset = () => {
    if (confirm('Are you sure you want to reset settings to defaults?')) {
      dispatch(resetSettings());
      toast.success('Settings reset to defaults');
    }
  }

  const onResetAll = () => {
    if (confirm('Are you sure you want to reset EVERYTHING to defaults? This will also delete all stored bookmarks, todos, and all stored data!')) {
      dispatch(resetSettings());
      dispatch(clearBookmarks());
      dispatch(clearTodos());
      toast.success('All settings reset to defaults and all stored data deleted');
    }
  }

  const onChange = (key: Setting) => (value: string) => {
    dispatch(changeSetting({ setting: key, value }));
  }

  return (
    <Card className="w-[500px]">
      <CardHeader className="w-full text-center font-bold text-4xl">
        Settings
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="grid grid-cols-[3fr_1fr] justify-between">
          {Object.entries(settings)
            .sort(([, a], [, b]) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
            .map(([key, state]) => (
              <Fragment key={key}>
                <div className="whitespace-pre-wrap">{state.name}</div>
                <Select name={key} value={state.value} onValueChange={onChange(key as Setting)}>
                  <SelectTrigger className="w-full">
                    <SelectValue>{state.value}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {VALUES[key as Setting].map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Fragment>
            ))}
        </div>
        <div className="flex gap-4 justify-center items-center w-full">
          <Button variant="outline" onClick={onResetAll}>Reset everything</Button>
          <Button variant="outline" onClick={onReset}>Reset settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}

const VALUES: Record<Setting, Array<string>> = {
  background: [
    'hourly',
    'daily',
    'weekly',
  ]
}