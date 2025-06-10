import { useState, useEffect, type HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

export function Clock(props: HTMLAttributes<HTMLElement>) {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <code {...props} className={cn("inline", props.className)}>
      {new Date(time).toLocaleTimeString(navigator.language)}
    </code>
  )
}

export const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  weekday: 'long',
}

export const getCurrentDate = (format?: Intl.DateTimeFormatOptions) => {
  return new Date().toLocaleDateString(navigator.language, { ...dateFormatOptions, ...format});
};