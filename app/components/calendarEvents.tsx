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
            <div className="col-span-3 row-span-4 w-full h-full my-2 flex flex-col items-center justify-center gap-8 font-light text-sm">
              <p>Nothing to do for now.</p>
              <div className="flex flex-wrap gap-2 items-center justify-center">
                <span>Press the</span>
                <Badge>Create new event</Badge>
                <span>button to schedule some stuff for yourself.</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div >
  )
}
