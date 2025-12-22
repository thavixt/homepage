import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";

export function Clock({ className }: { className?: string }) {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const startInterval = () => {
      if (!interval) {
        interval = setInterval(() => setTime(Date.now()), 1000);
      }
    };
    const stopInterval = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startInterval();
        setTime(Date.now());
      } else {
        stopInterval();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startInterval();

    return () => {
      stopInterval();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <code className={cn("inline", className)}>
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
  return new Date().toLocaleDateString(navigator.language, { ...dateFormatOptions, ...format });
};