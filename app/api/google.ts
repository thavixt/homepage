import { parseJwt } from "~/lib/jwt";

export interface GoogleUserData {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  /** URL */
  picture: string;
}

export async function getGoogleUserDataFromCredential(credential: string): Promise<GoogleUserData | null> {
  try {
    const payload = parseJwt(credential);
    return {
      id: payload.sub,
      email: payload.email,
      verified_email: payload.email_verified,
      name: payload.name,
      given_name: payload.given_name,
      family_name: payload.family_name,
      picture: payload.picture,
    };
  } catch {
    return null;
  }
}

export async function getGoogleUserDataWithAccessToken(accessToken: string): Promise<GoogleUserData | null> {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken}`);
  headers.append('Content-Type', 'application/json');
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    { headers },
  );
  const json = await response.json() as GoogleUserData;
  return json;
}

export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  htmlLink?: string;
}

export async function getGoogleUpcomingEvents(accessToken: string, maxResults: number = 10): Promise<GoogleCalendarEvent[]> {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${accessToken}`);
  headers.append('Content-Type', 'application/json');
  const params = new URLSearchParams({
    maxResults: maxResults.toString(),
    orderBy: 'startTime',
    singleEvents: 'true',
    timeMin: new Date().toISOString(),
  });
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
    { headers }
  );
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.items as GoogleCalendarEvent[];
}
