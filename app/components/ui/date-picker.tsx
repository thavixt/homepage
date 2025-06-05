import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import type { SelectSingleEventHandler } from "react-day-picker"

interface DatePickerProps {
  defaultValue?: Date;
  onChange?: (value?: Date) => void;
  id?: string;
  name?: string;
}

export function DatePicker({ name, id, defaultValue, onChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);

  const onSelect: SelectSingleEventHandler = (value) => {
    setDate(value);
    onChange?.(value);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          id={id}
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
      <input
        aria-hidden="true"
        defaultValue={(date ?? new Date()).toString()}
        hidden
        id={name}
        name={name}
        type="text"
        value={date?.toString()}
      />
    </Popover>
  )
}