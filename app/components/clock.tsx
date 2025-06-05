import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <code className="inline border rounded-md p-4">
      {new Date(time).toLocaleTimeString(navigator.language)}
    </code>
  )
}

export const getCurrentDate = () => {
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }
  return new Date().toLocaleDateString(navigator.language, dateFormatOptions);
};