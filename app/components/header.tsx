import { AlarmClockIcon, CalendarIcon, ChartLineIcon, CheckIcon, CloudSunIcon, HomeIcon, PenIcon, SettingsIcon } from "lucide-react";
import { Link } from "react-router";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "~/components/ui/navigation-menu"
import { sortBy } from "~/lib/utils";

type Feature = {
  href: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>;
  description: string;
};

const sortedFeatures: Feature[] = sortBy(
  "name",
  [
    {
      href: "/todos",
      name: "Todos",
      Icon: CheckIcon,
      description: "That sounds important - better write that down!"
    },
    {
      href: "/calendar",
      name: "Calendar",
      Icon: CalendarIcon,
      description: "What am I supposed to be doing this weekend?"
    },
    {
      href: "/notes",
      name: "Notes",
      Icon: PenIcon,
      description: "Keeping notes of the things that happened.",
    },
    {
      href: "/weather",
      name: "Weather forecast",
      Icon: CloudSunIcon,
      description: "I should bring an umbrella tomorrow..."
    },
    {
      href: "/timer",
      name: "Timer / reminder",
      Icon: AlarmClockIcon,
      description: "Set a timer or reminder for something important."
    },
  ],
);

export const FEATURES: Feature[] = [
  ...sortedFeatures,
  {
    href: "/stats",
    name: "Statistics",
    Icon: ChartLineIcon,
    description: "See how you are using this app.",
  },
  {
    href: "/settings",
    name: "Settings",
    Icon: SettingsIcon,
    description: "Change the way this app works.",
  },
];

export function Header() {
  return (
    <header className="flex flex-col items-center z-1000">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem title="Home">
            <NavigationMenuLink asChild>
              <Link viewTransition to="/">
                <HomeIcon size={18} className="text-blue-500" />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {FEATURES.map(({ Icon, ...feature }) => (
            <NavigationMenuItem title={`${feature.name} - ${feature.description}`} key={feature.href}>
              <NavigationMenuLink asChild>
                <Link viewTransition to={feature.href}>
                  <Icon size={18} className="text-blue-500" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}