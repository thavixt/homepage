import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Provider } from 'react-redux'
import { store } from './store'

import type { Route } from "./+types/root";
import "./app.css";
import { useEffect, useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { useAppDispatch, useAppSelector } from "./hooks/state";
import { incrementStat } from "./reducers/statsReducer";
import { getSettings } from "./reducers/settingsReducer";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.jpg" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Root({ mounted }: { mounted: boolean }) {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(getSettings);
  const backgroundChangeFrequency = settings.background.value;

  const seed = [
    backgroundChangeFrequency === 'monthly' ? new Date().getMonth() : '*',
    backgroundChangeFrequency === 'weekly' ? new Date().getDate() : '*',
    backgroundChangeFrequency === 'daily' ? new Date().getDay() : '*',
    backgroundChangeFrequency === 'hourly' ? new Date().getHours() : '*',
  ].join('-');

  const onClick = () => {
    dispatch(incrementStat('clicks'));
  }

  useEffect(() => {
    if (mounted) {
      return;
    }
    dispatch(incrementStat('opened'));
  }, [])

  useEffect(() => {
    // Remove the class to trigger fade-out
    document.body.classList.remove('bg-loaded');
    document.body.style.setProperty('--bg-img', `url('https://picsum.photos/seed/${seed}/1920/1080')`);
    setTimeout(() => {
      document.body.classList.add('bg-loaded');
    }, 250);
  }, [seed]);

  return (
    <div onClick={onClick}>
      <Outlet />
    </div>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  })

  return (
    <Provider store={store}>
      <Root mounted={mounted} />
      <Toaster />
    </Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
