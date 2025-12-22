import { CalendarDaysIcon } from "lucide-react";
import { Clock, getCurrentDate } from "../clock";
import { cn } from "~/lib/utils";

export function ClockWidget({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-4 items-center justify-between", className)}>
      <div className="flex gap-2 items-center">
        <CalendarDaysIcon />
        <span className="inline text-4xl">
          {getCurrentDate({ year: undefined })}
        </span>
      </div>
      <Clock className="p-4 text-7xl" />
    </div>
  )
}
