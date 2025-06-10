import { TodoList } from "~/components/todoList";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useTypesafeTranslation } from "~/i18n";

export function meta() {
  return [
    { title: "Homepage - Things to do" },
    { name: "description", content: "Better get on that!" },
  ];
}

export default function TodosPage() {
  const t = useTypesafeTranslation();
  return (
     <Card className=" backdrop-blur-lg w-full max-w-4xl flex flex-col items-center min-h-0">
      <CardHeader className="w-full text-center font-bold text-4xl">
        {t('todos.header')}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 w-full px-0">
        <TodoList />
      </CardContent>
    </Card>
  );
}
