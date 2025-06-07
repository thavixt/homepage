import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { changeSetting, getSettings, resetSettings, type Setting, type SettingsState } from "~/reducers/settingsReducer";
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
    toast.success('Settings reset to defaults');
    dispatch(resetSettings());
  }

  const onClearAllData = () => {
    window.localStorage.removeItem('homepage-redux-state');
    window.localStorage.removeItem('homepage-tanstack-query-offline-cache');
    toast.success('Reloading - all stored data was cleared/reset');
    setTimeout(() => {
      window.location.pathname = '/';
    }, 2000);
  }

  const onChange = <T extends Setting>(key: T) => (value: SettingsState[T]['value']) => {
    toast.success('Background update interval changed');
    dispatch(changeSetting({ setting: key, value }));
  }

  return (
    <Card className="w-full max-w-2xl flex flex-col items-center min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        Settings
      </CardHeader>
      <CardContent className="flex flex-col gap-4 w-full px-0">
        <Separator />
        <div className="grid grid-cols-[3fr_1fr] items-center justify-between px-4">
          {Object.keys(settings).map((k) => {
            const key = k as Setting;
            return (
              <SettingSelector
                key={key}
                settingsKey={key}
                onChange={onChange(key)}
              />
            )
          })}
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

function SettingSelector<T extends keyof SettingsState>({ settingsKey, onChange }: {
  settingsKey: T;
  onChange: (value: SettingsState[T]['value']) => void;
}) {
  const settings = useAppSelector(getSettings);
  const { id, label, value } = settings[settingsKey];

  return (
    <Fragment>
      <div className="whitespace-pre-wrap">{label}</div>
      <Select
        name={settingsKey}
        value={Object.keys(SETTINGS_VALUES[id]).find((k) => k === value)}
        onValueChange={(v) => onChange(v as SettingsState[T]['value'])}
      >
        <SelectTrigger className="w-full">
          <SelectValue>{value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SETTINGS_VALUES[id]).map(([k, v]) => (
            <SelectItem key={k} value={k}>{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Fragment>
  )
}

const SETTINGS_VALUES: Record<
  keyof SettingsState,
  Record<
    SettingsState[Setting]['value'],
    string
  >
> = {
  background: {
    '5min': '5 minutes',
    '15min': '15 minutes',
    '30min': '30 minutes',
    hour: '60 minutes',
    day: '24 hours',
    week: '7 days',
  }
}