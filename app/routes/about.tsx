import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Homepage - About" },
    { name: "description", content: "Some info about this Homepage site" },
  ];
}

export default function About() {
  return (
    <Card className="w-[500px]">
      <CardHeader className="w-full text-center font-bold text-4xl">
        About this page
      </CardHeader>
      <CardContent>
        TODO
      </CardContent>
    </Card>
  );
}
