import { isRouteErrorResponse } from "react-router";
import type { Route } from "../+types/root";
import { Button } from "./ui/button";

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