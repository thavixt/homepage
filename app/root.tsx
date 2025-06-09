import { useEffect, useState } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigate } from "react-router";
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { GoogleOAuthProvider } from '@react-oauth/google';
import type { Route } from "./+types/root";
import "./app.css";

import { store } from './store'
import { Toaster } from "./components/ui/sonner";
import { useAppDispatch, useAppSelector } from "./hooks/state";
import { incrementStat } from "./reducers/statsReducer";
import { getSettings, incrementBackgroundCounter, type BackgroundSettings } from "./reducers/settingsReducer";
import { getBackgroundSeed } from "./lib/utils";
import { Button } from "./components/ui/button";
import { LoaderCircle } from "lucide-react";
import { HotkeyContextProvider } from "./context/hotkeyContext";
import { FEATURES } from "./components/header";
import { toast } from "sonner";
import { AuthButton } from "./components/authButton";
import { UserContextProvider } from "./context/userContext";
import "./i18n";
import { useTranslation } from "react-i18next";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 12, // 12 hours
      networkMode: 'offlineFirst',
      retry: 3,
      staleTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});

function Root({ initialized }: { initialized: boolean }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(getSettings);
  const backgroundSeed = getBackgroundSeed(settings);
  const backgroundCounter = settings.background.counter;
  const backgroundSettingValue = settings.background.value;
  const { i18n } = useTranslation(); 

  const onClick = () => {
    dispatch(incrementStat({ stat: 'click' }));
  }

  const onHotkeyPressed = (hotkey: string) => {
    if (hotkey === ' ') {
      navigate('/', { viewTransition: true })
    }
    if (hotkey === 'B') {
      dispatch(incrementBackgroundCounter())
    }
    const route = FEATURES.find(feat => feat.hotkey.toUpperCase() === hotkey.toUpperCase());
    if (route) {
      navigate(route.href, { viewTransition: true })
    }
  }

  // TODO: this effect is trash imo
  useEffect(() => {
    if (initialized) {
      return;
    }
    dispatch(incrementStat({ stat: 'opened' }));
  }, [dispatch, initialized])

  useEffect(() => {
    // NOTE: set an intitial count if missing (?)
    // TODO: consider some migration processes instead
    if (typeof backgroundCounter !== 'number') {
      dispatch(incrementBackgroundCounter());
      return;
    }

    let cancelled = false;
    document.body.classList.remove('bg-loaded');
    const img = new Image();
    const backgroundSrc = `https://picsum.photos/seed/${backgroundSeed}/1920/1080`;

    img.addEventListener('load', () => {
      if (cancelled) {
        return;
      }
      document.body.style.setProperty('--bg-img', `url('${backgroundSrc}')`);
      document.body.classList.add('bg-loaded');
    });
    img.src = backgroundSrc;

    return () => {
      cancelled = true;
    };
  }, [backgroundCounter, backgroundSeed, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      toast('Background changed');
      dispatch(incrementBackgroundCounter());
    }, getMsByBackgroundSettingValue(backgroundSettingValue));
    return () => clearInterval(interval);
  }, [backgroundSettingValue, dispatch])

  if (!initialized || !i18n.isInitialized) {
    return <HydrateFallback />
  }

  return (
    <HotkeyContextProvider
      keys={FEATURES.map(feat => feat.hotkey.toUpperCase()).concat(' ', 'B')}
      onHotkeyPressed={onHotkeyPressed}
      modifier="shift"
    >
      <div onClick={onClick}>
        <Outlet />
      </div>
    </HotkeyContextProvider>
  );
}

export default function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) {
      return;
    }

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

    setInitialized(true);
  }, [initialized]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <UserContextProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={true} buttonPosition="bottom-left" />
          <ReduxProvider store={store}>
            <Root initialized={initialized} />
            <Toaster />
            <AuthButton />
          </ReduxProvider>
        </QueryClientProvider>
      </UserContextProvider>
    </GoogleOAuthProvider>
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

export function HydrateFallback() {
  return (
    <div className="h-screen w-screen flex gap-4 items-center justify-center animate-pulse">
      <LoaderCircle className='animate-spin' size={40} />
      <span className="ml-2 text-2xl font-semibold">Loading ...</span>
    </div>
  );
}

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

function getMsByBackgroundSettingValue(value: BackgroundSettings['value']) {
  switch (value) {
    case "5min":
      return 5 * 60 * 1000; // 5 min in ms
    case "15min":
      return 15 * 60 * 1000; // 15 min in ms
    case "30min":
      return 30 * 60 * 1000; // 30 min in ms
    case "hour":
      return 60 * 60 * 1000; // 1 hour in ms
    case "day":
      return 24 * 60 * 60 * 1000; // 1 day in ms
    case "week":
      return 7 * 24 * 60 * 60 * 1000; // 1 week in ms
    default:
      return 24 * 60 * 60 * 1000; // fallback to 1 day
  }
}
