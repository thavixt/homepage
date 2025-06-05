import type { Route } from "./+types/home";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { TodoList } from "~/components/todolist";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "@todo" },
    { name: "description", content: "Better get on that!" },
  ];
}

export default function Todos() {
  return (
    <Card className="w-full max-w-5xl flex flex-col items-center gap-8 min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        Things to do
      </CardHeader>
      <CardContent>
        <TodoList />
      </CardContent>
    </Card>
  );
}
