import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { changeSetting, getSettings, resetSettings, type Setting, type SettingsState, type SettingValueType } from "~/reducers/settingsReducer";
import { Fragment } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { AlertDialog } from "~/components/dialogs/alertDialog";
import { Separator } from "~/components/ui/separator";
import { clearBookmarks } from "~/reducers/bookmarksReducer";
import { clearCalendar } from "~/reducers/calendarReducer";
import { resetStats } from "~/reducers/statsReducer";
import { clearTodos } from "~/reducers/todosReducer";
import { useTypesafeTranslation } from "~/i18n";
import { sortArray } from "~/lib/utils";

export function meta() {
  return [
    { title: "Homepage - Settings" },
    { name: "description", content: "Tweak your home page a bit" },
  ];
}

export default function SettingsPage() {
  const t = useTypesafeTranslation();
  const settings = useAppSelector(getSettings);
  const dispatch = useAppDispatch();

  const onResetSettings = () => {
    dispatch(resetSettings());
  }

  const onClearAllData = () => {
    dispatch(clearBookmarks());
    dispatch(clearCalendar());
    dispatch(resetSettings());
    dispatch(resetStats());
    dispatch(clearTodos());
    window.localStorage.removeItem('homepage-redux-state');
    window.localStorage.removeItem('homepage-tanstack-query-offline-cache');
    toast.success(t('settings.reset.feedback'));
    setTimeout(() => {
      window.location.pathname = '/';
    }, 2000);
  }

  const onChange = <T extends Setting>(key: T) => (value: SettingsState[T]['value']) => {
    toast.success('Settings changed');
    dispatch(changeSetting({ setting: key, value }));
  }

  return (
    <Card className="backdrop-blur-lg w-full max-w-2xl flex flex-col items-center min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        {t('settings.header')}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 w-full px-0">
        <Separator />
        <div className="grid grid-cols-[1fr_250px] grid-rows-10 gap-2 items-start justify-start px-4 min-h-[300px]">
          {sortArray(Object.keys(settings)).map((k) => {
            const key = k as Setting;
            return <SettingSelector key={key} settingsKey={key} onChange={onChange(key)} />;
          })}
        </div>
        <Separator />
        <div className="flex gap-4 justify-center items-center w-full px-4">
          <AlertDialog
            trigger={<Button variant="ghost">{t('settings.clear')}</Button>}
            triggerAsChild
            onConfirm={onClearAllData}
            title={t('settings.clear.title')}
            description={t('settings.clear.description')}
            confirm={t('settings.clear')}
          />
          <AlertDialog
            trigger={<Button variant="outline">{t('settings.reset')}</Button>}
            triggerAsChild
            onConfirm={onResetSettings}
            title={t('settings.reset.title')}
            description={t('settings.reset.description')}
            confirm={t('settings.reset')}
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
  const values = getSettingValues<T>(settingsKey);
  const { label, value } = settings[settingsKey];

  return (
    <Fragment>
      <div className="whitespace-pre-wrap">{label}</div>
      <Select
        name={settingsKey}
        value={value}
        onValueChange={(v) => onChange(v as SettingsState[T]['value'])}
      >
        <SelectTrigger className="w-full">
          <SelectValue>{values[value as SettingValueType<T>]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(values).map(([k, v]) => (
            <SelectItem key={k} value={k}>{v as string}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Fragment>
  )
}

function getSettingValues<T extends Setting>(setting: T): Record<SettingValueType<T>, string> {
  if (setting === 'background') {
    return {
      '5min': '5 minutes',
      '15min': '15 minutes',
      '30min': '30 minutes',
      hour: '60 minutes',
      day: '24 hours',
      week: '7 days',
    } as Record<SettingsState[T]['value'], string>;
  }

  if (setting === 'language') {
    return {
      en: 'English',
      hu: 'Magyar',
      fr: 'Français',
      de: "Deutsch",
      es: "Española",
      ja: "日本語",
      pt: "Português",
      zh: "简体中文",
    } as Record<SettingsState[T]['value'], string>;
  }

  console.error(`Setting values not found for ${setting}.`);
  return {} as Record<SettingsState[T]['value'], string>;
}