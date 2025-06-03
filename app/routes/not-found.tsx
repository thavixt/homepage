import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "About this" },
    { name: "description", content: "Ummmmm..." },
  ];
}

export default function About() {
  return (
    <Card className="w-[500px]">
      <CardHeader className="w-full text-center font-bold text-4xl">
        That was a wrong turn :/
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-16 pb-4 gap-8">
        <Link to="/" className="link">Let's go back.</Link>
      </CardContent>
    </Card>
  );
}
