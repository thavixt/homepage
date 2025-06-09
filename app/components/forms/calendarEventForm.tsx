import { Label } from "../ui/label";
import { DatePicker } from "../ui/date-picker";
import { Textarea } from "../ui/textarea";
import type { CalendarEvent } from "~/reducers/calendarReducer";

export function CalendarEventForm({
  event,
  currentDate,
}: {
  event?: CalendarEvent;
  currentDate?: Date;
}) {
  return (
    <div className="grid gap-4 my-4">
      <div className="grid gap-3">
        <Label htmlFor="date">Date</Label>
        <DatePicker
          name="date"
          defaultValue={currentDate
            ? new Date(currentDate)
            : new Date()
          }
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="text">Description</Label>
        <Textarea
          autoFocus
          id="text"
          name="text"
          className="h-40 w-full resize-none"
          defaultValue={event?.text}
        />
      </div>
    </div>
  )
}