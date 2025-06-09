import { Trash2Icon, EditIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "~/hooks/state";
import { getDateString } from "~/lib/date";
import { type CalendarEvent, editEvent, deleteEvent } from "~/reducers/calendarReducer";
import { FormDialog } from "./dialogs/formDialog";
import { CalendarEventForm } from "./forms/calendarEventForm";
import { AlertDialog } from "./dialogs/alertDialog";

export function CalendarEventItem({ event, date }: { event: CalendarEvent, date: Date }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

  const onEditEvent: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedDate = formData.get("date") as string;
    const text = formData.get("text") as string;
    if (!date || !text) {
      toast.error('Must provide a date and description for the event');
      return;
    }
    dispatch(editEvent({
      id: event.id,
      date: getDateString(new Date(updatedDate)),
      text,
    }));
    setDialogOpen(false);
  }

  const onDeleteEvent = () => {
    dispatch(deleteEvent({ ...event, date: getDateString(date) }));
  }

  return (
    <div className="flex justify-between gap-2 border rounded-lg p-3 bg-primary-foreground/75">
      <div className="text-sm whitespace-pre-line">
        {event.text}
      </div>
      <div className="flex flex-col gap-2 items-center justify-end">
        <AlertDialog
          trigger={(
            <div className="border rounded-md p-1" title="Delete event">
              <Trash2Icon className="cursor-pointer" size={16} />
            </div>
          )}
          onConfirm={onDeleteEvent}
          title="Delete event"
          description={`Are you sure you want to delete this event?`}
        />
        <FormDialog
          trigger={(
            <div className="border rounded-md p-1" title="Delete all tasks">
              <EditIcon className="cursor-pointer" size={16} />
            </div>
          )}
          onSubmit={onEditEvent}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Edit event"
          description="Edit the date and description of this event."
        >
          <CalendarEventForm event={event} />
        </FormDialog>
      </div>
    </div>
  )
}