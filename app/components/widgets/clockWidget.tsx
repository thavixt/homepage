import { CalendarDaysIcon } from "lucide-react";
import { Clock, getCurrentDate } from "../clock";
import { cn } from "~/lib/utils";
import { AiGreetingWidget } from "./aiGreetingWidget";

export function ClockWidget({ className }: { className?: string }) {
  const date = getCurrentDate({ year: undefined });
  const [d1, d2] = date.split(", ");
  return (
    <div className={cn("flex flex-col md:flex-row gap-4 items-center justify-between", className)}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4 text-4xl items-center justify-center">
          <CalendarDaysIcon size="48" />
          <span className="flex flex-col">
            <div>{d1}</div>
            <div>{d2}</div>
          </span>
          <Clock className="p-4 text-7xl" iso />
        </div>
        <AiGreetingWidget className="row-span-2 col-span-2" />
      </div>
    </div>
  )
}
