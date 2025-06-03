import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Your home page" },
    { name: "description", content: "Welcome to the internet" },
  ];
}

export default function Home() {
  return (
    <Card className="w-[500px] flex flex-col items-center gap-8 min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        Welcome back!
        <Separator />
      </CardHeader>
      <CardContent className="max-w-[300px] w-full space-y-6 px-4">
        <ul>
          <li><Link className="link" to="todos">Cross out some of my todos</Link></li>
          <li><Link className="link" to="calendar">Check my calendar</Link></li>
          <li><Link className="link" to="notes">Write some notes</Link></li>
          <li><Link className="link" to="weather">Check the weather outside</Link></li>
        </ul>
        <ul>
          <li><Link className="link" to="stats">Stats collected on this page</Link></li>
          <li><Link className="link" to="about">About this application</Link></li>
        </ul>
        {/* <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
          Read useful resources:
        </p> */}
        <ul>
          {resources.map(({ href, text }) => (
            <li key={href}>
              <a
                className="link"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

const resources = [
  {
    href: "https://reactrouter.com/docs",
    text: "React Router docs",
  },
  {
    href: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts",
    text: "Redux docs",
  },
  {
    href: 'https://tailwindcss.com/docs/installation/using-vite',
    text: 'Tailwind docs'
  },
  {
    href: 'https://ui.shadcn.com/',
    text: 'Shadcn docs'
  }
];
