import { useEffect, useState } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigate } from "react-router";
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
import { changeSetting, getSettings, incrementBackgroundCounter } from "./reducers/settingsReducer";
import { LoaderCircle } from "lucide-react";
import { HotkeyContextProvider } from "./context/hotkeyContext";
import { FEATURES } from "./components/header";
import { AuthButton } from "./components/authButton";
import { UserContextProvider } from "./context/userContext";
import i18n from "./i18n";
import { I18nextProvider, useTranslation } from "react-i18next";
import { getMsByBackgroundSettingValue } from "./lib/background";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 12, // 12 hours
      networkMode: 'online',
      retry: 3,
      staleTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});

function Root({ initialized }: { initialized: boolean }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(getSettings);
  const currentLanguage = settings.language?.value;
  const backgroundCounter = settings.background.counter;
  const backgroundSettingValue = settings.background.value;
  const backgroundUrl = settings.background.currentUrl;

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

  // TODO: this effect is trash
  useEffect(() => {
    if (initialized) {
      return;
    }
    dispatch(incrementStat({ stat: 'opened' }));
  }, [dispatch, initialized])

  useEffect(() => {
    // set some initial state values
    // TODO: consider some migration process instead
    if (typeof backgroundCounter !== 'number') {
      dispatch(incrementBackgroundCounter());
      return;
    }
    if (typeof currentLanguage !== 'string') {
      dispatch(changeSetting({ setting: 'language', value: 'en' }));
      return;
    }

    let cancelled = false;
    document.body.classList.remove('bg-loaded');
    const img = new Image();

    img.addEventListener('load', () => {
      if (cancelled) {
        return;
      }
      document.body.style.setProperty('--bg-img', `url('${backgroundUrl}')`);
      document.body.classList.add('bg-loaded');
    });
    img.src = backgroundUrl;

    return () => {
      cancelled = true;
    };
  }, [backgroundCounter, backgroundUrl, currentLanguage, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
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
    <I18nextProvider i18n={i18n}>
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
    </I18nextProvider>
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

export { ErrorBoundary } from "./components/ErrorBoundary";

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