import { AlarmClockIcon, CalendarXIcon, ChartLineIcon, CheckCheckIcon, CloudSunIcon, HomeIcon, LightbulbIcon, PenIcon, SettingsIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "~/components/ui/navigation-menu"
import { cn, sortArrayOfObjectsBy } from "~/lib/utils";

type Feature = {
  href: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>;
  description: string;
  /**
   * Hotkey to press (Shift+<key>) to navigate to the route
   * 
   * NOTE: it's important to make hotkeys accessible with one hand
   * */
  hotkey: string;
};

const sortedFeatures: Feature[] = sortArrayOfObjectsBy(
  "name",
  [
    {
      href: "/ai",
      name: "AI assistant",
      description: "Ask anything",
      hotkey: "G",
      Icon: LightbulbIcon,
    },
    {
      href: "/todos",
      name: "Todos",
      Icon: CheckCheckIcon,
      description: "That sounds important - better write that down!",
      hotkey: 'T',
    },
    {
      href: "/calendar",
      name: "Calendar / diary",
      Icon: CalendarXIcon,
      description: "What am I supposed to be doing this weekend?",
      hotkey: 'C',
    },
    {
      href: "/notes",
      name: "Notes",
      Icon: PenIcon,
      description: "Keeping notes of the things that happened.",
      hotkey: 'X',
    },
    {
      href: "/weather",
      name: "Weather forecast",
      Icon: CloudSunIcon,
      description: "I should bring an umbrella tomorrow...",
      hotkey: 'W',
    },
    {
      href: "/timer",
      name: "Reminder / timer",
      Icon: AlarmClockIcon,
      description: "Set a timer or reminder for something important.",
      hotkey: 'R',
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
    hotkey: 'S',
  },
  {
    href: "/settings",
    name: "Settings",
    Icon: SettingsIcon,
    description: "Change the way this app works.",
    hotkey: 'Y',
  },
];

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="flex flex-col items-center mt-12 mb-4 md:mt-0">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem
            className={cn('rounded-xl border-6 border-transparent', {'border-slate-500': pathname === '/'})}
            title={`(Shift+Space) Home`}
          >
            <NavigationMenuLink asChild>
              <Link viewTransition to="/">
                <HomeIcon size={18} className="text-blue-500" />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {FEATURES.map(({ Icon, description, href, name, hotkey }) => (
            <NavigationMenuItem
              key={href}
              className={cn('rounded-xl border-6 border-transparent', {'border-slate-500': pathname === href})}
              title={`(Shift+${hotkey}) ${name} - ${description}`}
            >
              <NavigationMenuLink asChild>
                <Link viewTransition to={href}>
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
