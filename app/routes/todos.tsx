import { TodoList } from "~/components/todoList";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export function meta() {
  return [
    { title: "Homepage - Things to do" },
    { name: "description", content: "Better get on that!" },
  ];
}

export default function Todos() {
  return (
    <Card className="w-full max-w-2xl flex flex-col items-center min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        Things to do
      </CardHeader>
      <CardContent className="flex flex-col gap-4 w-full px-0">
        <TodoList />
      </CardContent>
    </Card>
  );
}
