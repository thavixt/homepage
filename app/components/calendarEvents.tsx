import { useAppSelector } from "~/hooks/state";
import { getDateString } from "~/lib/date";
import { getCalendarEvents } from "~/reducers/calendarReducer";
import { CalendarEventItem } from "./calendarEventItem";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

export function CalendarEvents({ date }: { date: Date }) {
  const events = useAppSelector(getCalendarEvents);
  const currentEvents = events[getDateString(date)] ?? [];

  return (
    <div className="flex flex-col gap-4 items-start justify-start size-full p-4">
      <ScrollArea className="w-full h-full">
        <div className="w-full h-full grid grid-cols-3 gap-4">
          {currentEvents.length ? (
            currentEvents.map(event => (
            <CalendarEventItem key={event.id} date={date} event={event} />
          ))
          ) : (
            <div className="col-span-3 p-4 flex flex-col items-center justify-center opacity-50 h-42 w-full">
              <div>Press the <Badge>Create new event</Badge> button above to schedule some stuff for yourself.</div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div >
  )
}
