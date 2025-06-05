import { CalendarIcon, ChartLineIcon, CheckCircleIcon, ClockAlertIcon, CloudSunIcon, HomeIcon, NotebookPenIcon, SettingsIcon, WrenchIcon } from "lucide-react";
import { Link } from "react-router";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "~/components/ui/navigation-menu"

export const FEATURES = [
  {
    href: "/todos",
    name: "Todos",
    Icon: CheckCircleIcon,
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
    Icon: NotebookPenIcon,
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
    Icon: ClockAlertIcon,
    description: "Set a timer or reminder for something important."
  },
].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
.concat([
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
]);

export function Header() {
  return (
    <header className="flex flex-col items-center z-1000">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem title="Home">
            <NavigationMenuLink asChild>
              <Link to="/">
                <HomeIcon size={18} className="text-blue-500" />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {FEATURES.map(({ Icon, ...feature }) => (
            <NavigationMenuItem title={`${feature.name} - ${feature.description}`} key={feature.href}>
              <NavigationMenuLink asChild>
                <Link to={feature.href}>
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