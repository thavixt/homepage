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
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    { headers },
  );
  const json = await response.json() as GoogleUserData;
  return json;
}
