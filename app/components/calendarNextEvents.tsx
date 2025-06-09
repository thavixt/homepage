import { useAppSelector } from "~/hooks/state";
import { getCalendarEvents, type CalendarEvent } from "~/reducers/calendarReducer";
import { ScrollArea } from "./ui/scroll-area";
import { getDateString } from "~/lib/date";

export function CalendarNextEvents() {
  const events = useAppSelector(getCalendarEvents);
  const eventsToday = events[getDateString(new Date)]

  return (
    <div className="flex flex-col gap-4">
      <div>Events today:</div>
      <ScrollArea>
        <div className="flex flex-col pb-4 gap-2 h-[200px] w-full">
          {eventsToday.map(event => (
            <CalendarNextEvent key={event.id} event={event} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function CalendarNextEvent({ event }: { event: CalendarEvent }) {
  return (
    <div className="border rounded-md p-3 whitespace-pre-line bg-primary-foreground/50">
      {event.text}
    </div>
  )
}
