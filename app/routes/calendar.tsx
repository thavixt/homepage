import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CalendarDiary } from "~/components/calendarDiary";
import { CalendarEvents } from "~/components/calendarEvents";
import { CalendarNextEvents } from "~/components/calendarNextEvents";
import { FormDialog } from "~/components/dialogs/formDialog";
import { CalendarEventForm } from "~/components/forms/calendarEventForm";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { dateFormatOptions } from "~/components/clock";
import { Separator } from "~/components/ui/separator";
import { useAppDispatch } from "~/hooks/state";
import { useTranslation } from "react-i18next";
import { getDateString } from "~/lib/date";
import { addEvent } from "~/reducers/calendarReducer";
// import { useGoogleCalendar } from "~/hooks/google";
import { useUser } from "~/context/userContext";

export function meta() {
  return [
    { title: "Calendar / Diary - Homepage" },
    { name: "description", content: "What's happening nowadays?" },
  ];
}

export default function CalendarPage() {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date>(new Date());
  const today = useRef(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  // const { events } = useGoogleCalendar();
  const { login } = useUser();

  const onDateSelected = (d: Date | null) => {
    if (!d) {
      return;
    }
    setDate(d);
  }

  const onToday = () => {
    setDate(today.current);
  }

  const onNextMonth = () => {
    const nextDate = new Date(date);
    nextDate.setMonth(date.getMonth() + 1);
    nextDate.setDate(1);
    setDate(nextDate);
  };

  const onPrevMonth = () => {
    const prevDate = new Date(date);
    prevDate.setMonth(date.getMonth() - 1);
    prevDate.setDate(1);
    setDate(prevDate);
  };

  const onSubmitEvent: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") as string;
    const date = formData.get("date") as string;
    if (!text || !date) {
      toast.error(t('error.calendar.required'));
      return;
    }
    const d = new Date(date);
    d.setHours(12);
    dispatch(addEvent({ date: getDateString(d), text }));
    setDialogOpen(false);
  }

  return (
    <Card>
      <CardHeader>
        {t('calendar.header')}
        <p className="text-sm font-normal">
          To sync with your Google Calendar, log in with the regular Google login flow by <a className="font-bold cursor-pointer" onClick={login}>clicking here</a>.
        </p>
      </CardHeader>
      <CardContent className="flex gap-8">
        <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_2fr] gap-4 items-center justify-center">
          <div className="flex flex-col items-center justify-start gap-4 h-full py-4">
            <div className="flex gap-2 items-center">
              <Button title="Previous month" size="sm" variant="outline" onClick={onPrevMonth}>
                <ArrowLeftIcon />
              </Button>
              <Button title="Current month" size="sm" variant="outline" onClick={onToday}>
                {t('common.today')}
              </Button>
              <Button title="Next month" size="sm" variant="outline" onClick={onNextMonth}>
                <ArrowRightIcon />
              </Button>
            </div>
            <Calendar
              className="rounded-md border shadow-sm"
              fixedWeeks
              hideNavigation
              mode="single"
              month={date}
              onSelect={onDateSelected}
              required
              selected={date}
              showWeekNumber
            />
            <div className="w-full p-4">
              <CalendarNextEvents />
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className="h-full grid grid-rows-[450px_200px] gap-2">
            <div className="flex flex-col gap-4 items-start justify-start size-full p-4">
              <div className="w-full flex items-center justify-between gap-4">
                <span>
                  {t('calendar.scheduledFor', {
                    date: date?.toLocaleDateString(navigator.language, dateFormatOptions)
                  })}
                </span>
                <FormDialog
                  trigger={<Button>{t('calendar.createEvent.description')}</Button>}
                  onSubmit={onSubmitEvent}
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  title={t('calendar.createEvent.title')}
                  description={t('calendar.createEvent.description')}
                >
                  <CalendarEventForm currentDate={date} />
                </FormDialog>
              </div>
              <CalendarEvents date={date} />
            </div>
            <div className="flex flex-col gap-2">
              <Separator />
              <CalendarDiary date={date} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
