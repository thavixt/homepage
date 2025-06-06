import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { changeSetting, getSettings, resetSettings, type BackgroundChangeFrequency, type Setting } from "~/reducers/settingsReducer";
import { Fragment } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { AlertDialog } from "~/components/dialogs/alertDialog";
import { Separator } from "~/components/ui/separator";

export function meta() {
  return [
    { title: "Homepage - Settings" },
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
    window.localStorage.removeItem('homepage-redux-state');
    window.localStorage.removeItem('homepage-tanstack-query-offline-cache');
    toast.success('Reloading - all stored data was cleared/reset');
    setTimeout(() => {
      window.location.pathname = '/';
    }, 2000);
  }

  const onChange = (key: Setting) => (value: string) => {
    // TODO: fix types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(changeSetting({ setting: key, value: value as any }));
  }

  return (
    <Card className="w-full max-w-2xl flex flex-col items-center min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        Settings
      </CardHeader>
      <CardContent className="flex flex-col gap-4 w-full px-0">
        <Separator />
        <div className="grid grid-cols-[3fr_1fr] items-center justify-between px-4">
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
                    {SETTINGS_VALUES[key as Setting].map(v => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Fragment>
            ))}
        </div>
        <Separator />
        <div className="flex gap-4 justify-center items-center w-full px-4">
          <AlertDialog
            trigger={<Button variant="ghost">Clear all app data</Button>}
            triggerAsChild
            onConfirm={onClearAllData}
            title="Clear all app data"
            description="Are you sure you want to reset EVERYTHING to defaults? This will reset all bookmarks, todos, and all other stored data and settings."
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

const SETTINGS_VALUES: Record<Setting, BackgroundChangeFrequency[]> = {
  background: [
    'hourly',
    'daily',
    'weekly',
    'monthly',
  ]
}