import { useEffect, useState } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import type { Route } from "./+types/root";
import "./app.css";

import { store } from './store'
import { Toaster } from "./components/ui/sonner";
import { useAppDispatch, useAppSelector } from "./hooks/state";
import { incrementStat } from "./reducers/statsReducer";
import { getSettings, incrementBackgroundCounter } from "./reducers/settingsReducer";
import { getBackgroundSeed } from "./lib/utils";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // TODO: review these defaults
      gcTime: 1000 * 60 * 60 * 12, // 12 hours
      networkMode: 'offlineFirst',
      refetchInterval: 30 * 60 * 1000, // 30 minutes
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
      retry: 3,
      staleTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});

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
  const backgroundSeed = getBackgroundSeed(settings);

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
    if (typeof settings.background.counter !== 'number') {
      dispatch(incrementBackgroundCounter());
      return;
    }
    document.body.classList.remove('bg-loaded');
    setTimeout(() => {
      document.body.style.setProperty('--bg-img', `url('https://picsum.photos/seed/${backgroundSeed}/1920/1080')`);
    }, 500);
    setTimeout(() => {
      document.body.classList.add('bg-loaded');
    }, 1000);
  }, [backgroundSeed]);

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

    if (typeof window !== "undefined") {
      const localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
        key: 'homepage-tanstack-query-offline-cache',
      });

      persistQueryClient({
        queryClient,
        persister: localStoragePersister,
      });
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} buttonPosition="bottom-left" />
      <ReduxProvider store={store}>
        <Root mounted={mounted} />
        <Toaster />
      </ReduxProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops! Something went really wrong.";
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

  const reload = () => {
    window.location.reload();
  }
  const resetAndReload = () => {
    window.localStorage.removeItem('homepage-redux-state');
    window.localStorage.removeItem('homepage-tanstack-query-offline-cache');
    reload();
  }

  return (
    <main className="flex flex-col gap-8 pt-16 p-4 container mx-auto">
      <h1 className="text-4xl">{message}</h1>
      <div>
        <div className="flex flex-col gap-2">
          <span>You could try to:</span>
          <ul className="flex flex-col gap-2">
            <li><Button onClick={reload}>Just reload the page</Button></li>
            <li><Button onClick={resetAndReload}>Reset all settings and reload</Button></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p>So the problem was: {details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto rounded border-2 bg-accent">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
