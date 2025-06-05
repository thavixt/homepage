import { ChartLineIcon, HomeIcon, SettingsIcon, WrenchIcon } from "lucide-react";
import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu"

const features: { title: string; link: string; description?: string }[] = [
  {
    title: "Todos",
    link: "todos",
    description: "That sounds important - better write that down!"
  },
  {
    title: "Calendar",
    link: "calendar",
    description: "What am I supposed to be doing this weekend?"
  },
  {
    title: "Notes",
    link: "notes",
    description: "Keeping notes of the things that happened.",
  },
  {
    title: "Weather",
    link: "weather",
    description: "I should bring an umbrella tomorrow..."
  }
]

export function Header() {
  return (
    <header className="flex flex-col items-center z-1000">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/">
                <HomeIcon size={18} className="text-blue-500" />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger><WrenchIcon size={18} className="text-blue-500" /></NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-4">
                {features.map(feature => (
                  <li key={feature.link}>
                    <NavigationMenuLink asChild>
                      <div>
                        <Link to={feature.link} className="flex flex-col gap-2">
                          <div className="font-medium">{feature.title}</div>
                          <p className="text-muted-foreground whitespace-pre-wrap">
                            {feature.description}
                          </p>
                        </Link>
                      </div>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/Stats">
                <ChartLineIcon size={18} className="text-blue-500" />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/settings">
                <SettingsIcon size={18} className="text-blue-500" />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}