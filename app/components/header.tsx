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
      {/* <div className="text-2xl font-semibold">Your home page</div> */}
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/">Index</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Apps</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-4">
                {features.map(feature => (
                  <li key={feature.link}>
                    <NavigationMenuLink asChild>
                      <Link to={feature.link}>
                        <div className="font-medium">{feature.title}</div>
                        {feature.description ? (
                          <div className="text-muted-foreground">
                            {feature.description}
                          </div>
                        ) : null}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/stats">Stats</Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link to="/settings">Settings</Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild>
            <Link to="/about">About</Link>
          </NavigationMenuLink>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}