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
import { AlertDialog } from "~/components/dialogs/alertDialog";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Homepage - Statistics" },
    { name: "description", content: "Tweak your home page a bit" },
  ];
}

export default function Stats() {
  const settings = useAppSelector(getSettings);
  const dispatch = useAppDispatch();

  const onResetSettings = () => {
    dispatch(resetSettings());
    toast.success('Settings reset to defaults');
  }

  const onClearAllData = () => {
    dispatch(resetSettings());
    dispatch(clearBookmarks());
    dispatch(clearTodos());
    toast.success('All settings reset to defaults and all stored data deleted');
  }

  const onChange = (key: Setting) => (value: string) => {
    // TODO: fix types
    dispatch(changeSetting({ setting: key, value: value as any }));
  }

  return (
    <Card className="w-[500px]">
      <CardHeader className="w-full text-center font-bold text-4xl">
        Settings
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="grid grid-cols-[3fr_1fr] items-center justify-between">
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
          <AlertDialog
            trigger={<Button variant="ghost">Clear all app data</Button>}
            triggerAsChild
            onConfirm={onClearAllData}
            title="Clear all app data"
            description="Are you sure you want to reset EVERYTHING to defaults? This will delete all stored bookmarks, todos, and all other stored data and settings."
            confirm="Reset everything to defaults"
          />
          <AlertDialog
            trigger={<Button variant="outline">Reset settings</Button>}
            triggerAsChild
            onConfirm={onResetSettings}
            title="Reset settings"
            description="Are you sure you want to reset settings to defaults?"
            confirm="Reset settings"
          />
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