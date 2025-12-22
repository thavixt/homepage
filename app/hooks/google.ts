import { useEffect, useState } from "react";
import { getGoogleUpcomingEvents, type GoogleCalendarEvent } from "~/api/google";
import { useUser } from "~/context/userContext";

export function useGoogleCalendar() {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [counter, setCounter] = useState(0);
  const { accessToken } = useUser();

  useEffect(() => {
    (async function fetchGoogleCalendarEvents() {
      console.log("fetch")
      if (!accessToken) {
        return;
      }
      const fetchedEvents = await getGoogleUpcomingEvents(accessToken);
      setEvents(fetchedEvents);
    })();
  }, [accessToken, counter]);

  return {
    events,
    refetch: () => setCounter(prev => prev + 1),
  }
}