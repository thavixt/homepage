import { useEffect, useState } from "react";

export async function getCurrentLocation(): Promise<string> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve(`${coords.latitude},${coords.longitude}`);
      },
      (error) => {
        console.error('Error getting location:', error);
        reject(error);
      }
    );
  })
}

export function useLocation() {
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    (async function queryCurrentLocation() {
      const l = await getCurrentLocation();
      setLocation(l);
    })();
  }, [])

  return location;
}